// functions/api/register.js

export async function onRequestPost(context) {
    try {
        const candidateData = await context.request.json();

        // ✅ YOUR EXACT RESEND API KEY
        const resendApiKey = 're_VgTdZX8M_PBfqQkpMTtosx78RZy6KAKqU'; 

        const emailPayload = {
            from: 'Nayi Subah Foundation <onboarding@resend.dev>',
            to: ['shirazsubhan961@gmail.com'], 
            subject: `🏛️ New Candidate Registration: ${candidateData.candidateName}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #059669;">Nayi Subah Foundation - New Candidate Registration</h2>
                    <hr />
                    <p><strong>Candidate Name:</strong> ${candidateData.candidateName}</p>
                    <p><strong>Contact Phone/WhatsApp:</strong> ${candidateData.candidatePhone}</p>
                    <p><strong>Email Address:</strong> ${candidateData.candidateEmail}</p>
                    <p><strong>Program Selected:</strong> ${candidateData.program}</p>
                    <p><strong>Remarks / Address:</strong> ${candidateData.notes}</p>
                    <hr />
                    <p style="font-size: 11px; color: #64748b;">Automated system submission sent via Cloudflare Pages Backend.</p>
                </div>
            `,
        };

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPayload),
        });

        const resendResult = await resendResponse.json();

        return new Response(JSON.stringify({ success: true, id: resendResult.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Email API Error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
