// AUTH: Authentication controller for Customers, Providers, and Admin
import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
import { ServiceProvider } from '../models/ServiceProvider.js';
import { generateToken, sanitizeUser } from '../utils/index.js';
import { ROLES, VERIFICATION_STATUS, ACCOUNT_STATUS } from '../config/constants.js';
import { ENV } from '../config/env.js';
import { sendNotificationEmail } from '../services/notificationService.js';

// Register Customer
export const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, mobileNumber, password, address } = req.body;

    if (!name || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, mobile number, and password are all required.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobileNumber: mobileNumber.trim(),
      password,
      role: ROLES.CUSTOMER
    });

    const customer = await Customer.create({
      user: user._id,
      adminApprovalStatus: VERIFICATION_STATUS.NOT_SUBMITTED,
      address: address || {}
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Customer account created successfully.',
      data: {
        token,
        user: sanitizeUser(user),
        customerProfile: customer
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register Service Provider
export const registerProvider = async (req, res, next) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      password,
      higherEducation,
      location,
      serviceArea,
      categories,
      expertise,
      experienceYears,
      bio
    } = req.body;

    if (!name || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, mobile number, and password are all required.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobileNumber: mobileNumber.trim(),
      password,
      role: ROLES.PROVIDER
    });

    const provider = await ServiceProvider.create({
      user: user._id,
      higherEducation: higherEducation ? String(higherEducation).trim() : '',
      location: location || {},
      serviceArea: Array.isArray(serviceArea) ? serviceArea : (serviceArea ? [serviceArea] : []),
      categories: Array.isArray(categories) ? categories : [],
      expertise: Array.isArray(expertise) ? expertise : [],
      experienceYears: Number(experienceYears) || 1,
      bio: bio || '',
      faceRegistered: false,
      documentsVerified: false,
      adminApproved: false,
      adminApprovalStatus: VERIFICATION_STATUS.PENDING
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Service Provider registered. Verification submission pending.',
      data: {
        token,
        user: sanitizeUser(user),
        providerProfile: provider
      }
    });
  } catch (error) {
    next(error);
  }
};

// Universal Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Record login timestamp and login history audit trail
    user.lastLoginAt = new Date();
    if (!user.loginHistory) user.loginHistory = [];
    user.loginHistory.push({
      loginAt: new Date(),
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
      userAgent: req.headers['user-agent'] || ''
    });
    if (user.loginHistory.length > 50) {
      user.loginHistory = user.loginHistory.slice(-50);
    }
    await user.save();

    let profile = null;
    if (user.role === ROLES.CUSTOMER) {
      profile = await Customer.findOne({ user: user._id });
    } else if (user.role === ROLES.PROVIDER) {
      profile = await ServiceProvider.findOne({ user: user._id });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token,
        user: sanitizeUser(user),
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get authenticated user info
export const getMe = async (req, res, next) => {
  try {
    let profile = null;
    if (req.user.role === ROLES.CUSTOMER) {
      profile = await Customer.findOne({ user: req.user._id });
    } else if (req.user.role === ROLES.PROVIDER) {
      profile = await ServiceProvider.findOne({ user: req.user._id });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(req.user),
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth Sign-In & Sign-Up
export const googleAuth = async (req, res, next) => {
  try {
    const { credential, role, profileData } = req.body;

    let email = '';
    let name = '';
    let googleId = '';
    let picture = '';

    if (credential && credential !== 'dev_token') {
      // Real Google Identity Services (GIS) ID Token verification
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!verifyRes.ok) {
          const errData = await verifyRes.json().catch(() => ({}));
          return res.status(401).json({
            success: false,
            message: errData.error_description || 'Invalid or expired Google token.'
          });
        }
        const tokenPayload = await verifyRes.json();

        // If GOOGLE_CLIENT_ID is configured, verify audience matches
        if (ENV.GOOGLE_CLIENT_ID && tokenPayload.aud !== ENV.GOOGLE_CLIENT_ID) {
          return res.status(401).json({
            success: false,
            message: 'Google token client audience mismatch.'
          });
        }

        email = tokenPayload.email;
        name = tokenPayload.name || tokenPayload.given_name || 'Google User';
        googleId = tokenPayload.sub;
        picture = tokenPayload.picture || '';
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: `Failed to verify Google credential: ${err.message}`
        });
      }
    } else if (profileData && profileData.email) {
      // Fast Developer/Demo simulation mode
      email = profileData.email;
      name = profileData.name || 'Google User';
      googleId = profileData.googleId || `google_${Date.now()}`;
      picture = profileData.picture || '';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Google credential or profile data is required.'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'No email address associated with this Google account.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }]
    });

    const targetRole = role === ROLES.PROVIDER ? ROLES.PROVIDER : ROLES.CUSTOMER;

    if (!user) {
      // Create new user authenticated via Google
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        googleId,
        authProvider: 'google',
        role: targetRole,
        profileImage: picture,
        accountStatus: ACCOUNT_STATUS.ACTIVE,
        mobileNumber: profileData?.mobileNumber || ''
      });

      if (targetRole === ROLES.CUSTOMER) {
        await Customer.create({
          user: user._id,
          adminApprovalStatus: VERIFICATION_STATUS.NOT_SUBMITTED,
          address: {}
        });
      } else if (targetRole === ROLES.PROVIDER) {
        await ServiceProvider.create({
          user: user._id,
          higherEducation: profileData?.higherEducation || '',
          location: {},
          serviceArea: [],
          categories: ['AC'],
          expertise: [],
          experienceYears: 1,
          bio: 'Fixora Certified Technician',
          faceRegistered: false,
          documentsVerified: false,
          adminApproved: false,
          adminApprovalStatus: VERIFICATION_STATUS.PENDING
        });
      }
    } else {
      // Link Google authentication to existing user
      let needsSave = false;
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        needsSave = true;
      }
      if (!user.profileImage && picture) {
        user.profileImage = picture;
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    }

    // Record login timestamp and login history audit trail
    user.lastLoginAt = new Date();
    if (!user.loginHistory) user.loginHistory = [];
    user.loginHistory.push({
      loginAt: new Date(),
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
      userAgent: req.headers['user-agent'] || ''
    });
    if (user.loginHistory.length > 50) {
      user.loginHistory = user.loginHistory.slice(-50);
    }
    await user.save();

    let profile = null;
    if (user.role === ROLES.CUSTOMER) {
      profile = await Customer.findOne({ user: user._id });
    } else if (user.role === ROLES.PROVIDER) {
      profile = await ServiceProvider.findOne({ user: user._id });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Signed in with Google successfully.',
      data: {
        token,
        user: sanitizeUser(user),
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// Universal Profile Update for All Roles (Customer, Provider, Admin)
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      mobileNumber,
      profileImage,
      address,
      higherEducation,
      experienceYears,
      bio,
      location,
      serviceArea,
      categories,
      isAvailable,
      currentPassword,
      newPassword
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    // 1. Password update if requested
    if (newPassword) {
      if (!currentPassword && user.password) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password.'
        });
      }
      if (user.password) {
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({
            success: false,
            message: 'Current password does not match.'
          });
        }
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters.'
        });
      }
      user.password = newPassword;
    }

    // 2. User fields
    if (name !== undefined) user.name = name.trim();
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber.trim();
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    // 3. Role-specific profile updates
    let profile = null;
    if (user.role === ROLES.CUSTOMER) {
      profile = await Customer.findOne({ user: user._id });
      if (profile && address !== undefined) {
        profile.address = {
          street: address.street !== undefined ? address.street : profile.address?.street || '',
          city: address.city !== undefined ? address.city : profile.address?.city || '',
          state: address.state !== undefined ? address.state : profile.address?.state || '',
          pincode: address.pincode !== undefined ? address.pincode : profile.address?.pincode || ''
        };
        await profile.save();
      }
    } else if (user.role === ROLES.PROVIDER) {
      profile = await ServiceProvider.findOne({ user: user._id });
      if (profile) {
        if (higherEducation !== undefined) profile.higherEducation = String(higherEducation).trim();
        if (experienceYears !== undefined) profile.experienceYears = Number(experienceYears) || 0;
        if (bio !== undefined) profile.bio = String(bio).trim();
        if (location !== undefined) {
          profile.location = {
            city: location.city !== undefined ? location.city : profile.location?.city || '',
            state: location.state !== undefined ? location.state : profile.location?.state || '',
            pincode: location.pincode !== undefined ? location.pincode : profile.location?.pincode || '',
            address: location.address !== undefined ? location.address : profile.location?.address || ''
          };
        }
        if (serviceArea !== undefined) {
          profile.serviceArea = Array.isArray(serviceArea)
            ? serviceArea
            : serviceArea.split(',').map((s) => s.trim()).filter(Boolean);
        }
        if (categories !== undefined && Array.isArray(categories)) {
          profile.categories = categories;
        }
        if (isAvailable !== undefined) {
          profile.isAvailable = Boolean(isAvailable);
        }
        await profile.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: sanitizeUser(user),
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// 1. Change password using last remembered/current password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    if (user.password) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'The current password you entered does not match our records.'
        });
      }
    }

    user.password = newPassword;
    user.passwordResetOtp = { code: null, expiresAt: null };
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// 2. Send 4-digit verification code to user's registered email
export const sendPasswordOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    // Generate random 4-digit code (e.g. 1000 - 9999)
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetOtp = {
      code: otpCode,
      expiresAt
    };
    await user.save();

    // Send email via notificationService
    const emailResult = await sendNotificationEmail({
      toEmail: user.email,
      subject: 'Fixora - Your 4-Digit Password Verification Code',
      textContent: `Hello ${user.name},\n\nYour 4-digit Fixora password reset code is: ${otpCode}\n\nThis code will expire in 10 minutes. If you did not request this, please secure your account.\n\nFixora Security Team`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">Fixora Security Verification</h2>
          <p style="color: #334155; font-size: 15px;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #475569; font-size: 14px;">Use the 4-digit verification code below to authorize changing your password:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #4f46e5; background: #eef2ff; padding: 12px 28px; border-radius: 12px; border: 2px dashed #6366f1;">
              ${otpCode}
            </span>
          </div>
          <p style="color: #64748B; font-size: 13px;">This code is valid for <strong>10 minutes</strong>. If you did not request this change, please ignore this email.</p>
        </div>
      `
    });

    console.log(`[PASSWORD OTP] 4-digit OTP for ${user.email}: ${otpCode}`);

    return res.status(200).json({
      success: true,
      message: `A 4-digit verification code has been sent to ${user.email}.`,
      emailSent: emailResult.sent,
      devOtp: !emailResult.sent ? otpCode : undefined
    });
  } catch (error) {
    next(error);
  }
};

// 3. Verify 4-digit code and update password
export const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { otpCode, newPassword } = req.body;

    if (!otpCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both the 4-digit verification code and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    if (!user.passwordResetOtp || !user.passwordResetOtp.code) {
      return res.status(400).json({
        success: false,
        message: 'No active verification code found. Please click "Send Code" first.'
      });
    }

    // Check expiration
    if (new Date() > new Date(user.passwordResetOtp.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new 4-digit code.'
      });
    }

    // Check code match
    if (user.passwordResetOtp.code !== String(otpCode).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 4-digit verification code. Please check your email and try again.'
      });
    }

    // Update password and clear OTP
    user.password = newPassword;
    user.passwordResetOtp = { code: null, expiresAt: null };
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully with verification code!'
    });
  } catch (error) {
    next(error);
  }
};


