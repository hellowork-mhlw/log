import nodemailer from 'nodemailer'

export async function POST(request) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }

    try {
        // リクエストボディを解析
        const { host, port, secure, user, pass, to, subject, text, html } = await request.json()

        // Nodemailerトランスポート設定
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure, // true for 465, false for other ports
            auth: {
                user, // SMTPユーザー名
                pass, // SMTPパスワード
            },
        })

        // メールの送信設定
        const mailOptions = {
            from: user, // 送信元アドレス
            to, // 宛先アドレス（カンマ区切りで複数指定可能）
            subject, // 件名
            text, // テキスト形式の本文
            html, // HTML形式の本文（任意）
        }

        // メール送信
        const info = await transporter.sendMail(mailOptions)

        return new Response(JSON.stringify({ message: 'Email sent', info }), { headers })
    } catch (error) {
        return new Response(error.message, { status: 400, headers })
    }
}