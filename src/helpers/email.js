import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "aa0406f392607a",
      pass: "e646df3ebcf361",
    },
  });

  // Mail Info
  const info = await transport.sendMail({
      from: '"FundMyMusic" <confirm@fundmymusic.com>',
      to: email,
      subject: "FundMyMusic - Confirma tu cuenta",
      text: "Confirma tu cuenta de FundMyMusic",
      html: `<p> Hola: ${name} Confirma tu cuenta de FundMyMusic</p>
      <p>Debes acceder al siguiente enlace para confirmar tu cuenta:
      <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirma tu cuenta</a>     
      `,
  })
};
