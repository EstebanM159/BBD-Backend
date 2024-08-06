// agregar userId
import { transporter } from '../config/nodemailer'
import dotenv from 'dotenv'
dotenv.config()
interface IEmail {
    email:string,
    userName:string,
    token:string,
    tokenId: string
}
export class AuthEmail {
    static sendPasswordResetToken = async (user:IEmail)=>{
       const info = await transporter.sendMail({
            from: 'Barberia <admin@barberia.com>',
            to: user.email,
            subject: 'Barberia - Recupera tu contraseña',
            text: 'Barberia - Recupera tu contraseña',
            html: `
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Restablecimiento de Contraseña</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 50px auto;
                                    background-color: #ffffff;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                .content-container{
                                    padding:20px;
                                    display: flex;
                                    flex-direction: column;
                                    gap: 10px;
                                }
                                .content-container p{
                                    margin: 0;
                                }
                                h1 {
                                    color: #fff;
                                    background-color: #34473e;
                                    padding-top:20px ;
                                    height: 100%;
                                    padding: 20px 50px;
                                }
                                p {
                                    font-size: 16px;
                                    line-height: 1.5;
                                    color: #666666;
                                }
                                a.button {
                                    display: inline-block;
                                    margin-top: 20px;
                                    padding: 10px 20px;
                                    font-size: 16px;
                                    color: #ffffff;
                                    background-color: #007BFF;
                                    text-decoration: none;
                                    border-radius: 5px;
                                }
                                a.button:hover {
                                    background-color: #0056b3;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Restablecimiento de Contraseña</h1>
                                    <p style="margin: 0 50px; padding: 10px 0;">Hola ${user.userName},</p>
                                    <p style="margin: 0 50px; padding: 10px 0;">Has solicitado restablecer tu contraseña. Por favor, haz clic en el botón a continuación para restablecer tu contraseña:</p>
                                    <a href="${process.env.FRONTEND_URL}/auth/nueva-contraseña/${user.tokenId}" style="margin: 0 50px; padding: 10px 0;">Restablecer contraseña</a>
                                    <p style="margin: 0 50px; padding: 10px 0;">E ingresa este codigo: <span class="font-weight:900;">${user.token}</span></p>
                                    <p style="margin: 0 50px; padding: 10px 0;">Si no solicitaste este cambio, simplemente ignora este correo.</p>
                                    <p style="text-align: center;">Gracias, El equipo de Barberia</p>
                            </div>
                        </body>
                        </html>
        `
        })
        console.log('Mensaje enviado', info.messageId)
    }

    // static sendPasswordResetToken = async (user:IEmail)=>{
    //     const info = await transporter.sendMail({
    //         from: 'UpTask <admin@uptask.com>',
    //         to: user.email,
    //         subject: 'UpTask - Restablece tu contraseña',
    //         text: 'UpTask - Restablece tu contraseña',
    //         html:  `<p>Hola ${user.userName}, has solicitado reestablecer tu contraseña</p>
    //                 <p>Visita el siente enlace: </p> <a href="${process.env.FRONTEND_URL}/auth/new-password/${user.tokenId}">Restablecer contraseña</a>
    //                 <p>E ingresa el siguiente codigo: <b>${user.token}</b></p>
    //                 <p>Este token expira en 10 minutos</p>
    //             `
    //     })

    //     console.log('Mensaje enviado', info.messageId)
    // }
    
}