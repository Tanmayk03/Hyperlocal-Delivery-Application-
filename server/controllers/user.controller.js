import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import sendEmail from '../config/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generateRefreshToken from '../utils/generateRefreshToken.js';
import generateAccessToken from '../utils/generateAccessToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import generateOtp from '../utils/generateOtp.js'; 
import jwt from 'jsonwebtoken';


export async function registerUserController(req, res) {
  try {
    console.log("Request body:", req.body);

    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
        error: true,
        success: false
      });
    }

    const userExists = await UserModel.findOne({ email });
    console.log("userExists:", userExists);

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
        error: true,
        success: false
      });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    
    // Generate secure verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
      verificationToken,
      verify_email: false
    });

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      sendTo: email,
      subject: "Verify your email - Blinkit Clone",
      html: verifyEmailTemplate({ name, url: verifyEmailUrl })
    });

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      success: true,
      error: false
    });

  } catch (error) {
    console.error("RegisterUserController Error:", error);
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
}

export async function verifyEmailController(req, res) {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
        error: true,
        success: false
      });
    }

    // Update user and remove verification token
    await UserModel.updateOne(
      { _id: user._id }, 
      { 
        verify_email: true,
        verificationToken: null
      }
    );

    return res.json({
      message: "Email verified successfully",
      error: false,
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        error: true,
        success: false
      });
    }

    // Check password first
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid password",
        error: true,
        success: false
      });
    }

    // Check for email verification
   // if (!user.verify_email) {
     // return res.status(400).json({
      //  message: "Please verify your email first",
      //  error: true,
       // success: false
      //});
   // }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Account is inactive. Contact admin",
        error: true,
        success: false
      });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),

    })
    // Fixed cookie options for Postman (local development)
    const cookieOptions = {
      httpOnly: true,
      secure: false, // Must be false for HTTP (Postman local testing)
      sameSite: 'Lax', // Changed from 'None' to 'Lax' for local testing
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      message: "Login successful",
      success: true,
      error: false,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          status: user.status
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error("Login Controller Error:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

// Logout controller
export async function logoutController(request,response){
    try {
        const userid = request.userId //middleware

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.clearCookie("accessToken",cookiesOption)
        response.clearCookie("refreshToken",cookiesOption)

        await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return response.json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//upload user avatar
export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId;           // ✅ Set from auth middleware
    const image = request.file;              // ✅ From multer

    if (!image) {
      return response.status(400).json({
        message: "No image file uploaded",
        error: true,
        success: false
      });
    }

    const uploaded = await uploadImageCloudinary(image); // Upload to Cloudinary

    await UserModel.findByIdAndUpdate(
      userId,
      { avatar: uploaded.secure_url },
      { new: true } // returns updated doc
    );

    return response.json({
      message: "Profile uploaded successfully",
      success: true,
      error: false,
      data: {
        _id: userId,
        avatar: uploaded.secure_url // ✅ Fixed this line
      }
    });



  } catch (error) {
    console.error("Upload Avatar Error:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

// Update user details
export async function updateUserDetails(request,response){
    try {
        const userId = request.userId //auth middleware
        const { name, email, mobile, password } = request.body 

        let hashPassword = ""

        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt)
        }

        const updateUser = await UserModel.updateOne({ _id : userId},{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return response.json({
            message : "Updated successfully",
            error : false,
            success : true,
            data : updateUser
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
// forgotPassword
export async function forgotPasswordContoller(request, response) {
  try {
    const { email } = request.body;

    if (!email) {
      return response.status(400).json({
        message: "Email is required",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email not found",
        error: true,
        success: false
      });
    }

    const otp = generateOtp();
    const expireTime = Date.now() + 60 * 60 * 1000; // 1 hour

    // ✅ Make sure this updates correctly
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        forgot_password_otp: otp.toString(),
        forgot_password_expiry: new Date(expireTime)
      },
      { new: true } // ✅ Return the updated document
    );

    console.log("OTP saved to user:", updatedUser.forgot_password_otp);

    await sendEmail({
      sendTo: email, // ✅ Fixed typo
      subject: "Forgot password from Blinkit",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp
      })
    });

    return response.json({
      message: "Check your email",
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false
    });
  }
}

//verifyotp
export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide required fields: email and otp.",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false
      });
    }

    // Check if OTP & expiry exist
    if (!user.forgot_password_otp || !user.forgot_password_expiry) {
      return response.status(400).json({
        message: "No OTP request found. Please request again.",
        error: true,
        success: false
      });
    }

    const currentTime = new Date();
    const otpExpiryTime = new Date(user.forgot_password_expiry);

    if (otpExpiryTime < currentTime) {
      return response.status(400).json({
        message: "OTP has expired",
        error: true,
        success: false
      });
    }

    if (otp.toString() !== user.forgot_password_otp.toString()) {
      return response.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false
      });
    }

    // OTP is valid
    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: null,
      forgot_password_expiry: null
    });

    return response.json({
      message: "OTP verified successfully",
      error: false,
      success: true
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return response.status(500).json({
      message: error.message || "Something went wrong",
      error: true,
      success: false
    });
  }
}
// reset password
export async function resetpassword(request,response){
    try {
        const { email , newPassword, confirmPassword } = request.body 

        if(!email || !newPassword || !confirmPassword){
            return response.status(400).json({
                message : "Provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "newPassword and confirmPassword must be same.",
                error : true,
                success : false,
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return response.json({
            message : "Password updated successfully.",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
// refresh token
export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies?.refreshToken ||
      request.headers?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return response.status(401).json({
        message: "Refresh token missing",
        error: true,
        success: false,
      });
    }

    let verifyToken;
    try {
      verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    } catch (err) {
      console.error("Refresh token verification error:", err);
      return response.status(403).json({
        message: "Refresh token is invalid or expired",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken?.id; // ✅ fix here

    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized access",
        error: true,
        success: false,
      });
    }

    const newAccessToken = generateAccessToken(userId);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", newAccessToken, cookieOptions);

    return response.json({
      message: "New access token generated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}
// get login user details
export async function userDetails(req, res) {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select("-password -refresh_token");
    
    return res.json({
      message: "User details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}
