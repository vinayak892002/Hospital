const { fileUpload } = require("../../uploadMiddleware/index");

const express = require("express");
const app = express();
const userTableModel = require("../../models/workerTable");
// const adminTableModel = require("../../models/adminTable");
const {getUserFromDb} = require("../auth/index")

const {tokenValidation} = require("../../utils/validation")

const dotenv = require("dotenv");
const crypto = require("crypto-js");
const fs = require("fs");
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ACCESS_KEY = process.env.ACCESS_KEY;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
// const {
//   checkUserExists,
//   updateUserData,
//   getSpecificUser,
// } = require("../../utils/updateUser");

const userIdRegex = /^(WIN|WFM)\d{3,}$/;

const roles = ["CUS", "ENT", "DEV", "DCF", "SPL", "WIN", "WFM", "ADM"];

const reverseUrlRoleMap = {
  WIN: "workpro",
  WFM: "workman-firm",
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN);
  } catch (error) {
    return null;
  }
};

const decryptUserId = (encryptedUserId) => {
  const bytesUserId = crypto.AES.decrypt(encryptedUserId, PRIVATE_KEY, {
    mode: crypto.mode.CBC,
  });
  return bytesUserId.toString(crypto.enc.Utf8);
};

const decryptUserRole = (encryptedRole) => {
  const bytesRole = crypto.AES.decrypt(encryptedRole, PRIVATE_KEY, {
    mode: crypto.mode.CBC,
  });
  return bytesRole.toString(crypto.enc.Utf8);
};

const updateUser = async (req, res) => {
  try {
    const { data, sessData, updateId } = JSON.parse(req.body.textData);

    const tokenValidationResp = await tokenValidation(req, sessData);
    
    if (tokenValidationResp.status === 401) {
      return res.status(401).send(tokenValidationResp.resp);
    }

    const { userId, role } = tokenValidationResp;

    // let token = null;
    // token =
    //   "worker-portal" in req.cookies ? req.cookies["worker-portal"] : sessData;

    // if (
    //   token == "null" ||
    //   token == "undefined" ||
    //   token == null ||
    //   token == undefined
    // ) {
    //   return res
    //     .status(401)
    //     .send({ message: "Unauthorised Access", redirect: "/login" });
    // }

    // const decoded = verifyToken(token);

    // if (
    //   !(
    //     typeof decoded === "object" &&
    //     decoded !== null &&
    //     "userId" in decoded &&
    //     "role" in decoded
    //   )
    // ) {
    //   return res
    //     .status(401)
    //     .send({ message: "Unauthorised Access", redirect: "/login" });
    // }
    // const userId = decryptUserId(decoded.userId);

    // const bytesUserId = crypto.AES.decrypt(decoded.userId, PRIVATE_KEY, {
    //   mode: crypto.mode.CBC,
    // });
    // const userId = bytesUserId.toString(crypto.enc.Utf8);

    // const role = decryptUserRole(decoded.role);
    // if (!roles.includes(role)) {
    //   return res
    //     .status(401)
    //     .send({ message: "Unauthorised Access", redirect: "/login" });
    // }

    // Validate that userId is provided
    if (!userId) {
      return res
        .status(400)
        .send({ message: "Unauthorised Access", redirect: "/login" });
    } else {
      if (data["userEmail"]) {
        // const userFound = await checkUserExists(null, null, data["userEmail"]);
        const userFound = await userTableModel.findOne({ userEmail: data["userEmail"] }).lean();
        // console.log("userFound: ", userFound.userId, updateId);
        const userDetails = await userTableModel.findOne({ userId: updateId });
        if (userFound && updateId !== userFound.userId) {
          return res.status(409).send({ message: "Email Id already in use." });
        }
        // let userDetails = await getSpecificUser(updateId);
        if (!userDetails) {
          return res.status(404).json({ message: "User not found" });
        }
        // await updateUserData({
        //   id: {
        //     [updateId]: { ...userDetails, userEmail: data["userEmail"] },
        //   },
        //   mobile: {},
        //   email: { [data["userEmail"]]: updateId },
        // });
      }
      // if (data["access"]) {
      //   // const userFound = await checkUserExists(updateId);
      //   const userFound = await getUserFromDb("id", updateId);
      //   if (userFound && updateId !== userFound) {
      //     return res.status(409).send({ message: "Email Id already in use." });
      //   }
      //   // let userDetails = await getSpecificUser(updateId);
      //   let userDetails = await getUserFromDb("id", updateId);

      //   // await updateUserData({
      //   //   id: {
      //   //     [updateId]: {
      //   //       ...userDetails,
      //   //       access: {
      //   //         employee: data["access"]["employee"],
      //   //         client: data["access"]["client"],
      //   //         case: data["access"]["case"],
      //   //         accessManager: data["access"]["accessManager"],
      //   //       },
      //   //     },
      //   //   },
      //   //   mobile: {},
      //   //   email: {},
      //   // });

      //   await userTableModel.updateOne(
      //     { userId: updateId },
      //     { $set: { access: data["access"] } }
      //   );

      // }
      // let user = null;
      // let otherRole = updateId.slice(0, 3);
      // if (otherRole == "ADM") {
      //   user = await adminTableModel.updateOne(
      //     { userId: updateId }, // Query to find the document
      //     { $set: data }
      //   );
      // } else {
      //   user = await userTableModel.updateOne(
      //     { userId: updateId }, // Query to find the document
      //     { $set: data }
      //   );
      // }

      let user = await userTableModel.updateOne(
        { userId: updateId },
        { $set: data }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      else return res.status(200).send({ message: "User Data Updated.", data });
    }
  } catch (error) {
    // Handle any errors that occur
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

// const checkProfileAccess = async (userId, role, otherId) => {
//   let otherUserRole = otherId.slice(0, 3);
//   if (role == "ADM") {
//     let myData = await getSpecificUser(userId);
//     let myAccess = !myData
//       ? false
//       : !myData["access"]
//       ? false
//       : myData["access"];
//     if (!myAccess) {
//       return {
//         status: 401,
//         message: "Unauthorised Access",
//         redirect: `/admin/profile`,
//       };
//     }
//     if (otherUserRole == "ADM") {
//       if (!myData["access"]["employee"]) {
//         return {
//           status: 401,
//           message: "Unauthorised Access",
//           redirect: `/admin/profile`,
//         };
//       } else {
//         return { editAccess: myData["access"], editable: false };
//       }
//     } else {
//       if (!myData["access"]["client"]) {
//         return {
//           status: 401,
//           message: "Unauthorised Access",
//           redirect: `/admin/profile`,
//         };
//       } else {
//         return {
//           editAccess: myData["access"],
//           editable: otherUserRole == "WIN",
//         };
//       }
//     }
//   } else {
//     const userExists = await userTableModel.exists({
//       userId: userId,
//       childFirms: { $in: [otherId] },
//     });

//     const result = !!userExists;
//     if (!result) {
//       return {
//         status: 401,
//         message: "Unauthorised Access",
//         redirect: `/${reverseUrlRoleMap[role]}/profile`,
//       };
//     } else {
//       return {
//         editable: otherUserRole == "WIN",
//       };
//     }
//   }
// };

const getUserData1 = async (req, res) => {
  try {
    const { userData, user, id } = req.query;
    let token = null;
    token =
      "worker-portal" in req.cookies ? req.cookies["worker-portal"] : userData;

    if (
      token == "null" ||
      token == "undefined" ||
      token == null ||
      token == undefined
    ) {
      return res
        .status(401)
        .send({ message: "Unauthorised Access", redirect: "/login" });
    }

    const decoded = verifyToken(token);

    if (
      !(
        typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded &&
        "role" in decoded
      )
    ) {
      return res
        .status(401)
        .send({ message: "Unauthorised Access", redirect: "/login" });
    }

    const userId = decryptUserId(decoded.userId);

    // Validate that userId is provided
    if (!userId) {
      return res
        .status(401)
        .send({ message: "Unauthorised Access", redirect: "/login" });
    }

    const role = decryptUserRole(decoded.role);
    if (!roles.includes(role) || reverseUrlRoleMap[role] !== user) {
      return res
        .status(401)
        .send({ message: "Unauthorised Access", redirect: "/login" });
    }
    if (id !== "null") {
      if (!userIdRegex.test(id)) {
        return res.status(400).send({ message: "Requested User ID invalid." });
      }
      if (role == "CUS" || role == "WIN") {
        return res.status(400).send({
          message: "Unauthorised Access",
          redirect: `/${reverseUrlRoleMap[role]}/profile`,
        });
      }
      // let idFound = await checkUserExists(id);
      const idFound = await getUserFromDb("id", id);
      if (!idFound) {
        return res.status(404).send({ message: "User not found." });
      }
    }

    if (role === "WIN") {
      return res.status(401).send({
        message: "Unauthorised Access",
        redirect: `/profile`,
      });
    }

    let data = null;
    // if (id == "null" || id == userId) {
    //   if (role == "ADM") {
    //     data = await adminTableModel.findOne({ userId }, "-password").lean();
    //   } else {
    //     data = await userTableModel.findOne({ userId }, "-password").lean();
    //   }
    //   data = { ...data, editable: true, editAccess: null };
    // } else {
    //   let resp = await checkProfileAccess(userId, role, id);
    //   if (resp["status"]) {
    //     return res.status(resp["status"]).send(resp);
    //   } else {
    //     let otherUserAdmin = id.slice(0, 3) == "ADM";
    //     if (otherUserAdmin) {
    //       data = await adminTableModel
    //         .findOne({ userId: id }, "-password")
    //         .lean();
    //     } else {
    //       data = await userTableModel
    //         .findOne({ userId: id }, "-password")
    //         .lean();
    //     }
    //     data = { ...data, ...resp };
    //   }
    // }

    if (id === "null" || id === userId) {
      data = await userTableModel.findOne({ userId }, "-password").lean();
      data = { ...data, editable: true, editAccess: null };
    } 
    return res.status(200).send({ user: data });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error." });
  }
};

const getUserData = async (req, res) => {
  try {
    const { sessData, urlRole, id } = req.query;

    let token = req.cookies["piombo-worker-token"] || sessData;
    console.log("token: ", sessData, urlRole, id);

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).send({ message: "Unauthorised Access", redirect: "/login" });
    }

    const tokenValidationResp = await tokenValidation(req, sessData, urlRole);

    if (tokenValidationResp.status === 401) {
      return res.status(401).send(tokenValidationResp.resp);
    }

    const { userId, role } = tokenValidationResp;

    if (id === "null" || id === userId) {
      let data = await userTableModel.findOne({ userId }, "-password").lean();
      data = { ...data, editable: true, editAccess: null };
      return res.status(200).send({ user: data });
    }

    if (role === "WIN") {
      return res.status(401).send({
        message: "Unauthorised Access",
        redirect: `/profile`,
      });
    }

    if (!userIdRegex.test(id)) {
      return res.status(400).send({ message: "Requested User ID is invalid." });
    }

    const targetUser = await userTableModel.findOne({ userId: id }).lean();

    if (!targetUser) {
      return res.status(404).send({ message: "User not found." });
    }

    if (targetUser.parentFirm !== userId) {
      return res.status(403).send({ message: "Access Denied: You are not authorized to view this worker's data." });
    }

    return res.status(200).send({ user: targetUser });

  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: "Internal Server Error." });
  }
};


const calProfilePercentage1 = async (req, res) => {
  console.log("Function calProfilePercentage called");
  try {
    console.log("Request Body: ", req.body);
    const { user } = req.body;

    if (!user) {
      console.error("User data is missing");
      return res.status(400).send({ message: "User data is required." });
    }

    const requiredFieldsBasic = ["userName", "userMobile", "userEmail"];
    const requiredFieldsBankDetails = [
      "BankDetails.name",
      "BankDetails.branchName",
      "BankDetails.accNo",
      "BankDetails.ifsc",
      "BankDetails.micr",
      "BankDetails.canceledCheque",
    ];

    const calculateCompletion = (user, requiredFields) => {
      console.log("Calculating completion for fields: ", requiredFields);
      const completedFields = requiredFields.filter((field) => {
        const value = field
          .split(".")
          .reduce((o, i) => (o ? o[i] : undefined), user);
        console.log(`Value for field ${field}:`, value); // Log the value for debugging

        // Check if value is a string or a number before calling trim
        if (value != null) {
          return String(value).trim() !== ""; // Convert value to string for trimming
        }

        return false; // Treat null or undefined values as incomplete
      }).length;

      return (completedFields / requiredFields.length) * 100;
    };

    const completionBasicPage = calculateCompletion(user, requiredFieldsBasic);
    console.log("Completion Basic Page: ", completionBasicPage);

    const completionBankPage = calculateCompletion(
      user,
      requiredFieldsBankDetails
    );
    console.log("Completion Bank Page: ", completionBankPage);

    const totalFields =
      requiredFieldsBasic.length + requiredFieldsBankDetails.length;
    const completedFields = completionBasicPage + completionBankPage;

    const completionPercentage = (completedFields / totalFields) * 100;

    return res.status(200).send({ completionPercentage });
  } catch (error) {
    console.error("Error calculating profile percentage: ", error);
    return res.status(500).json({
      message: "An error occurred while calculating the profile percentage.",
    });
  }
};

const calProfilePercentage = async (req, res) => {
  console.log("Function calProfilePercentage called");
  try {
    console.log("Request Body: ", req.body);
    const { user } = req.body;

    if (!user) {
      console.error("User data is missing");
      return res.status(400).send({ message: "User data is required." });
    }

    const sections = {
      basic: {
        requiredFields: ["userName", "userMobile", "userEmail"],
      },
      bank: {
        requiredFields: [
          "BankDetails.name",
          "BankDetails.branchName",
          "BankDetails.accNo",
          "BankDetails.ifsc",
          "BankDetails.micr",
          "BankDetails.canceledCheque",
        ],
      },
      education: {
        requiredFields: [
          "EducationDetails.basicEducation",
          "EducationDetails.technicalQualification",
          "EducationDetails.uploadCertificate",
        ],
      },
    };

    const calculateCompletion = (user, requiredFields) => {
      const completedFields = requiredFields.filter((field) => {
        const value = field
          .split(".")
          .reduce((o, i) => (o ? o[i] : undefined), user);
        return value != null && String(value).trim() !== "";
      }).length;

      return completedFields;
    };

    let totalFields = 0;
    let completedFieldsCount = 0;

    for (const [key, section] of Object.entries(sections)) {
      if (key === "education") {
        const educationComplete = section.requiredFields.every((field) => {
          const value = field
            .split(".")
            .reduce((o, i) => (o ? o[i] : undefined), user);
          return value != null && String(value).trim() !== "";
        });

        totalFields += 1;
        if (educationComplete) {
          completedFieldsCount += 1;
        }
      } else {
        const completedFields = calculateCompletion(
          user,
          section.requiredFields
        );
        totalFields += section.requiredFields.length;
        completedFieldsCount += completedFields;
      }
    }

    const completionPercentage =
      totalFields > 0 ? (completedFieldsCount / totalFields) * 100 : 0;

    console.log("completionPercentage: ", completionPercentage);
    return res.status(200).send({ completionPercentage });
  } catch (error) {
    console.error("Error calculating profile percentage: ", error);
    return res.status(500).json({
      message: "An error occurred while calculating the profile percentage.",
    });
  }
};

module.exports = { updateUser, getUserData, calProfilePercentage };
