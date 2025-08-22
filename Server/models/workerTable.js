const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  userName: { type: String, default: null },
  userEmail: { type: String, default: null },
  userMobile: { type: Number, default: null },
  userAddress: {
    address: { type: String, default: null },
    locality: { type: String, default: null },
    landmark: { type: String, default: null },
    pincode: { type: Number, default: null },
    district: { type: String, default: null },
    state: { type: String, default: null },
  },
  userRole: { type: String, default: null },
  userProfilePic: { type: String, default: null },
  userPassword: { type: String, default: null },
  userCompanyName: { type: String, default: null },
  userCompanyType: { type: String, default: null },
  userOpenToWork: { type: Boolean, default: false },

  authorizedPerson: [
    {
      _id: false, // Prevent _id creation for each authorizedPerson
      authPersonName: { type: String, default: null },
      authPersonEmail: { type: String, default: null },
      authPersonMobile: { type: Number, default: null },
      authPersonDesignation: { type: String, default: null },
    },
  ],
  escalation: [
    {
      _id: false, // Prevent _id creation for each escalation
      escalationName: { type: String, default: null },
      escalationEmail: { type: String, default: null },
      escalationMobile: { type: Number, default: null },
      escalationDesignation: { type: String, default: null },
    },
  ],
  PAN: {
    value: { type: String, default: null },
    links: [{ type: String, default: null }],
  },
  GST: {
    value: { type: String, default: null },
    link: { type: String, default: null },
  },
  CIN: {
    value: { type: String, default: null },
    link: { type: String, default: null },
  },
  MSME: {
    value: { type: String, default: null },
    link: { type: String, default: null },
  },
  aadhaar: {
    value: { type: String, default: null },
    links: [{ type: String, default: null }],
  },
  pf: {
    value: { type: String, default: null },
    link: { type: String, default: null },
  },
  esic: {
    value: { type: String, default: null },
    link: { type: String, default: null },
  },
  BankDetails: {
    name: { type: String, default: null },
    branchName: { type: String, default: null },
    ifsc: { type: String, default: null },
    micr: { type: String, default: null },
    accNo: { type: String, default: null },
    cancelledCheque: { type: String, default: null },
  },
  AffiliationType: {
    companyActivity: [{ type: String, default: null }],
    brandName: [{ type: String, default: null }],
    product: [{ type: String, default: null }],
    projectLocation: { type: String, default: null },
    marketSegment: [{ type: String, default: null }],
    handlingMaterials: { type: Boolean, default: false },
    materialList: [{ type: String, default: null }],
    levelOfExpertise: { type: String, default: null },
  },
  EducationDetails: {
    basicEducation: { type: String, default: null },
    technicalQualification: { type: String, default: null },
    technicalQualificationSpecialization: { type: String, default: null },
    uploadCertificate: { type: String, default: null },
  },
  LanguageDetails: [
    {
      _id: false, // Prevent _id creation for each language detail
      name: { type: String, default: null },
      speakingProficiency: { type: String, default: null },
      writingProficiency: { type: String, default: null },
      readingProficiency: { type: String, default: null },
    },
  ],
  SkillDetails: [
    {
      _id: false, // Prevent _id creation for each skill detail
      serviceType: { type: String, default: null },
      application: { type: String, default: null },
      category: { type: String, default: null },
      subCategory: { type: String, default: null },
      experience: { type: String, default: null },
      certifications: [{ type: String, default: null }],
      training: { type: Boolean, default: false },
      testimonials: [{ type: String, default: null }],
    },
  ],
  ServiceAreas: [
    {
      _id: false, // Prevent _id creation for each service area
      state: { type: String, default: null },
      districts: { type: [String], default: ["All"] },
    },
  ],
  parentFirm: { type: String, default: null },
  referralCode: { type: String, default: null },
  childFirms: [{ type: String, default: null }],
  cases: [
    {
      _id: false,
      caseId: { type: String, default: "" },
      date: { type: String, default: "" },
      timeSlot: { type: String, default: "" },
      unassigned: { type: Boolean, default: false }, // if true, workpro has worked on case but is now no more assigned to case
    },
  ],
  declinedCases: [{ type: String, default: null }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  approvalStatus: { type: Boolean, default: false },
  approvalRemark: { type: String, default: null },
  profilePercentage: { type: String, default: "0" },
});

const workerTableModel = mongoose.model("userTable", workerSchema);

module.exports = workerTableModel;
