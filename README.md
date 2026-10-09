# FIXORA
> **Tagline:** Diagnose. Troubleshoot. Find the Right Expert.  
> **Product Type:** AI-powered Home Appliance & Consumer Electronics Troubleshooting and Verified Service Provider Platform.

Fixora helps customers identify problems with home appliances and electronic devices safely through AI-assisted troubleshooting, and connects customers with verified service providers when professional assistance is required.

---

## 🚀 Key Highlights & Architectural Guarantees

1. **Strict Light Theme Only**: Modern, clean, accessible professional UI inspired by the design system specifications. Zero dark mode or neon styling.
2. **11 Supported Device Categories**:
   - `TV`
   - `Wi-Fi / Router`
   - `Laptop`
   - `Phone`
   - `Projector / Home Theatre / Speaker`
   - `Washing Machine`
   - `Refrigerator`
   - `AC`
   - `Computer`
   - `Microwave Oven`
   - `Printer`
3. **Role-Based Access Control (RBAC)**:
   - **Customer**: Registration, preliminary Aadhaar submission, AI troubleshooting. Provider search is strictly locked until Admin Approval.
   - **Service Provider**: Registration, device camera face registration, trade document upload, expertise tags. Hidden from customer search until all 3 criteria are approved (`faceRegistered === true && documentsVerified === true && adminApproved === true`).
   - **Admin**: Oversight dashboard, customer Aadhaar approval/rejection/resubmission, provider face/document review, category inspections, request audits.
4. **AI Safety Directives & Escalation**: Prohibits dangerous internal appliance repairs (e.g. microwave magnetrons, capacitors, refrigerator refrigerants, high-voltage mains wiring). Immediately escalates to verified service technicians with clear safety warnings.
5. **Deterministic Provider Ranking Formula**:
   $$\text{Score} = (\text{Expertise} \times 0.50) + (\text{Location/Availability} \times 0.30) + (\text{Rating} \times 0.20)$$
6. **Provider NEW Badge**: Awarded if approved within 30 days (`approvedAt`). Informational only, no artificial rating boost. Displays `NEW · No reviews yet` for providers without service history.
7. **Complete Service Request Lifecycle**:
   $$\text{PENDING} \longrightarrow \text{ACCEPTED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED} \longrightarrow \text{RATINGS \& REVIEWS}$$

---

## 🛠 Tech Stack

- **Frontend**: React 19 (Vite), Lucide Icons, Custom Light Theme Design System
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose with embedded fallback for turnkey execution)
- **API Testing**: Postman Collection (`Fixora_API_Collection.postman_collection.json`)

---

## 🔑 Quick Demo Credentials

For rapid evaluation and testing, the platform pre-seeds the following verified demo accounts:

| Role | Email | Password | Status |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fixora.com` | `AdminPassword@123` | Active & Verified |
| **Customer** | `customer@fixora.com` | `CustomerPassword@123` | Approved (Search unlocked) |
| **Service Provider** | `suresh.ac@fixora.com` | `ProviderPassword@123` | Approved (AC & Fridge Specialist) |
| **Service Provider** | `vikram.tv@fixora.com` | `ProviderPassword@123` | Approved (TV Specialist) |
| **Service Provider** | `techrevive@fixora.com` | `ProviderPassword@123` | Approved (NEW Badge · Laptops) |

---

## 💻 Running the Application Locally

### 1. Start the Backend API Server
```bash
cd backend
npm install
node src/server.js
```
The server will start on `http://localhost:5000`.

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
The application will be live at `http://localhost:5173`.

---

## 🧪 Postman API Testing

Import the included collection:
- `Fixora_API_Collection.postman_collection.json`

The collection covers:
- `1. Authentication` (Health check, Login, Customer registration, Provider registration)
- `2. Customer Verification` (Profile, Aadhaar upload)
- `3. Provider Verification` (Private profile, Face registration, Documents, Expertise)
- `4. Admin Oversight & Approvals` (Stats, Customer review, Provider review)
- `5. AI Troubleshooting Chatbot` (11 Categories, Safe query, Dangerous hardware escalation)
- `6. Provider Search & Matching` (Ranking formula, Public profile)
- `7. Service Requests & Reviews` (Booking, Status transitions, Rating submission)
- `8. Notifications` (In-app alerts, Mark as read)

---

## 🛡 Verification & Safety Directives

- **Customer Preliminary Checks**: System verifies 12-digit format, file format (PDF/JPEG/PNG), file size, and checks duplicate records. Clearly distinguished from final administrator approval.
- **Provider Face Registration**: Utilizes browser webcam stream with frame snapshot and liveness confidence scoring.
- **Provider Documents**: Requires trade qualification (diploma, ITI certificate, experience proof) before admin review.
