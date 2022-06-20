import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";

import UserModel from "../models/userModel.js";
import generateIdToken from "../helpers/generateIdToken.js";
import generateJWT from "../helpers/generateJWT.js";
import { emailRegister, emailForgotPass } from "../helpers/email.js";

import dotenv from "dotenv";
dotenv.config();

const singUp = async (req, res) => {
  // Check errors
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      const error = new Error("Este correo ya esta registrado");
      return res.status(400).json({ msg: error.message });
    }

    // Create user
    user = new UserModel(req.body);
    //user.token = generateIdToken();

    // TODO:Poner de nuevo validar correo
    // Hashear password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    // Save user
    await user.save();

    // Email
    //emailRegister({
    //  email: user.email,
    //  name: user.name,
    //  token: user.token,
    //});

    //res.json({
    //  msg: "Usuario creado correctamente, revisa tu email para confirmar la cuenta",
    //});

    res.json({
      _id: user._id,
      email: user.email,
      stageName: user.stageName,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      role: user.role,
      balance: user.balance,
      savedConcerts: user.savedConcerts,
      purchasedTickets: user.purchasedTickets,
      token: generateJWT(user),
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("SingUp Error");
  }
};

const singIn = async (req, res) => {
  // Check errors
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, password, from } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      const error = new Error("Este correo no ha sido registrado");
      return res.status(404).json({ msg: error.message });
    }

    if (user.role !== from) {
      const error = new Error("No tienes permisos para iniciar sesión aquí");
      return res.status(404).json({ msg: error.message });
    }

    // Check confirmed
    if (!user.confirmed) {
      const error = new Error("Tu cuenta aun no ha sido confirmada");
      return res.status(404).json({ msg: error.message });
    }

    // Check password
    const correctPass = await bcryptjs.compare(password, user.password);
    if (!correctPass) {
      const error = new Error("Contraseña o Email Incorrecto");
      return res.status(404).json({ msg: error.message });
    }

    // Check confirmed
    if (!user.confirmed) {
      const error = new Error("Tu cuenta aun no ha sido confirmada");
      return res.status(404).json({ msg: error.message });
    } else {
      res.json({
        _id: user._id,
        email: user.email,
        stageName: user.stageName,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        role: user.role,
        balance: user.balance,
        savedConcerts: user.savedConcerts,
        purchasedTickets: user.purchasedTickets,
        token: generateJWT(user),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("SingIn Error");
  }
};

const authenticatedUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Authenticated Error" });
  }
};

const confirmIdToken = async (req, res) => {
  const { token } = req.params;
  const user = await UserModel.findOne({ token });
  if (!user) {
    return res.status(403).json({ msg: "Link inválido" });
  }
  try {
    user.confirmed = true;
    user.token = "Confirmed";
    await user.save();
    res.json({ msg: "Cuenta confirmada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Confirm Error" });
  }
};

const resetPasswordResetToken = async (req, res) => {
  const { email } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user) {
    const error = new Error("Este correo no esta registrado");
    return res.status(404).json({ msg: error.message });
  }
 
  try {
    user.token = generateIdToken();
    await user.save();
    //Email
    emailForgotPass({
      email: user.email,
      name: user.name,
      token: user.token,
    });
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "ResetPass Error" });
  }
};

const resetPasswordCheckToken = async (req, res) => {
  const { token } = req.params;
  const user = await UserModel.findOne({ token });
  if (user) {
    res.json({ msg: "Valid Token" });
  } else {
    return res.status(404).json({ msg: "Link inválido" });
  }
};

const resetPasswordNewPass = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await UserModel.findOne({ token });
  if (user) {
    try {
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);
      user.token = "Confirmed";
      await user.save();
      res.json({ msg: "Contraseña actualizada" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "ResetPassNew Error" });
    }
  } else {
    return res.status(404).json({ msg: "Token Inválido" });
  }
};

const deleteUser = async (req, res) => {
  // Check errors
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    // Check password
    const correctPass = await bcryptjs.compare(password, user.password);
    if (!correctPass) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // Delete user
    await user.delete();
    return res.json({ msg: "User has been deleted" });
  } catch (error) {
    console.log(error);
    res.status(400).send("DeleteUser Error");
  }
};

const profile = async (req, res) => {
  const user = req.user;
  //let user = await UserModel.findOne({ id });
  res.json(user);
};

const editProfile = async (req, res) => {
  const user = req.body;
  try {
    const findUser = await UserModel.findById(user._id);
    if (!findUser) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }

    const { _id, stageName, name, surname, phone, balance } = req.body;

    const update = {};
    update.stageName = stageName;
    update.name = name;
    update.surname = surname;
    update.phone = phone;
    update.balance = balance;

    const newUser = await UserModel.findByIdAndUpdate(
      { _id: _id },
      { $set: update },
      { new: true }
    ).select("-password -confirmed -token -createdAt -updatedAt -__v");
    res.json(newUser);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

export {
  singUp,
  singIn,
  authenticatedUser,
  confirmIdToken,
  resetPasswordResetToken,
  resetPasswordCheckToken,
  resetPasswordNewPass,
  deleteUser,
  profile,
  editProfile,
};
