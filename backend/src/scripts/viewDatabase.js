// SCRIPT: Comprehensive database viewer to inspect all collections and data in Fixora
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
import { ServiceProvider } from '../models/ServiceProvider.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { KnowledgeBase } from '../models/KnowledgeBase.js';
import { DeviceCategory } from '../models/DeviceCategory.js';

const inspectData = async () => {
  try {
    await connectDB();

    console.log('\n========================================================================================');
    console.log('                          FIXORA DATABASE EXPLORER (MONGODB)                            ');
    console.log('========================================================================================\n');

    // 1. Users (Registered & Last Login Date/Time)
    const users = await User.find({}, '-password').sort({ createdAt: -1 }).lean();
    console.log(`📌 1. REGISTERED USERS & LOGIN TRACKING (Total: ${users.length})`);
    console.table(
      users.map((u) => ({
        Name: u.name,
        Email: u.email,
        Role: u.role,
        RegisteredAt: u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A',
        LastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never logged in',
        LoginsCount: (u.loginHistory || []).length
      }))
    );

    // 2. Admin Verifications & Documentations: Customers
    const customers = await Customer.find({}).populate('user', 'name email').lean();
    console.log(`\n📌 2. CUSTOMER VERIFICATIONS & DOCUMENTATION (Total: ${customers.length})`);
    console.table(
      customers.map((c) => ({
        CustomerName: c.user?.name || 'N/A',
        Email: c.user?.email || 'N/A',
        AdminApproval: c.adminApprovalStatus,
        ApprovedAt: c.approvedAt ? new Date(c.approvedAt).toLocaleDateString() : 'Pending',
        AadhaarDoc: c.aadhaarDocument?.fileUrl ? 'Uploaded ✅' : 'Missing ❌',
        City: c.address?.city || 'N/A'
      }))
    );

    // 3. Admin Verifications & Documentations: Service Providers
    const providers = await ServiceProvider.find({}).populate('user', 'name email').lean();
    console.log(`\n📌 3. SERVICE PROVIDER VERIFICATIONS & DOCUMENTATION (Total: ${providers.length})`);
    console.table(
      providers.map((p) => ({
        ProviderName: p.user?.name || 'N/A',
        Email: p.user?.email || 'N/A',
        AdminApproval: p.adminApprovalStatus,
        ApprovedAt: p.approvedAt ? new Date(p.approvedAt).toLocaleDateString() : 'Pending',
        FaceBiometric: p.faceRegistered ? 'Verified ✅' : 'Pending ❌',
        DocsCount: (p.documents || []).length,
        Experience: `${p.experienceYears || 0} yrs`,
        Education: p.higherEducation || 'N/A'
      }))
    );

    // 4. Customer Service Requests (What device contains issue, what is the issue)
    const requests = await ServiceRequest.find({})
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`\n📌 4. CUSTOMER SERVICE REQUESTS (Total: ${requests.length})`);
    if (requests.length === 0) {
      console.log('  No customer requests stored yet. (Create one via the Customer portal to test)');
    } else {
      console.table(
        requests.map((r) => ({
          ReqNo: r.requestNumber,
          Customer: r.customer?.name || 'Unknown',
          Device: r.deviceCategory,
          BrandModel: `${r.brand || ''} ${r.modelNumber || ''}`.trim() || 'N/A',
          Issue: r.problemDescription.length > 40 ? r.problemDescription.slice(0, 37) + '...' : r.problemDescription,
          Status: r.status,
          CreatedAt: r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A'
        }))
      );
    }

    // 5. Chatbot Knowledge Base
    const kbEntries = await KnowledgeBase.find({}).lean();
    console.log(`\n📌 5. CHATBOT KNOWLEDGE BASE (Total: ${kbEntries.length} diagnostic rules)`);
    console.table(
      kbEntries.slice(0, 11).map((kb) => ({
        Device: kb.deviceCategory,
        Problem: kb.problem,
        HighRisk: kb.isHighRiskHardware ? 'HIGH RISK ⚠️' : 'Safe Exterior ✅',
        ServiceDomain: kb.serviceDomain
      }))
    );

    // 6. Device Categories
    const categories = await DeviceCategory.find({}).lean();
    console.log(`\n📌 6. DEVICE CATEGORIES (Total: ${categories.length})`);
    console.log(categories.map((c) => ` • ${c.name} (${c.commonProblems?.length || 0} common problems configured)`).join('\n'));

    console.log('\n========================================================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('Database inspection failed:', error.message);
    process.exit(1);
  }
};

inspectData();
