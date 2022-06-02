import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Mail Info
  const info = await transport.sendMail({
      from: '"FundMyMusic" <fundmymusiic@gmail.com>',
      to: email,
      subject: "FundMyMusic - Confirma tu cuenta",
      text: "Confirma tu cuenta de FundMyMusic",
      html: `<p> Bienvenido ${name}, Confirma tu cuenta de FundMyMusic</p>
      <p>Debes acceder al siguiente enlace para confirmar tu cuenta:
      <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirma tu cuenta</a>     
      `,
  })
};
