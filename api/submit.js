// api/submit.js

export default async function handler(req, res) {
    // Разрешаем только POST запросы
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { description, contact } = req.body;

    // Проверка на дурака
    if (!description || !contact) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    // ТВОИ ДАННЫЕ ИЗ БОТА (Берем из переменных окружения Vercel)
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Формируем сообщение (Markdown)
    const text = `
🔥 *НОВАЯ ЗАЯВКА - LOUD STUDIO*

📝 *Суть:*
${description}

👤 *Контакт:*
\`${contact}\`
    `;

    try {
        // Шлем в телегу
        const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        return res.status(200).json({ status: 'Ok' });

    } catch (error) {
        console.error('Telegram API Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}