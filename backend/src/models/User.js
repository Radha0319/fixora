// DB: User authentication and identity schema
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, ACCOUNT_STATUS } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    mobileNumber: {
      type: String,
      trim: true,
      default: ''
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: [6, 'Password must be at least 6 characters']
    },
    googleId: {
      type: String,
      sparse: true,
      index: true
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
      index: true
    },
    accountStatus: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
      index: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    lastLoginAt: {
      type: Date,
      default: null,
      index: true
    },
    loginHistory: [
      {
        loginAt: { type: Date, default: Date.now },
        ipAddress: { type: String, default: '' },
        userAgent: { type: String, default: '' }
      }
    ],
    passwordResetOtp: {
      code: { type: String, default: null },
      expiresAt: { type: Date, default: null }
    }
  },
  {
    timestamps: true
  }
);

// AUTH: Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// AUTH: Compare entered password with stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
