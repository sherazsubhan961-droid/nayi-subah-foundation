export async function onRequestPost(context) {
    const { request, env } = context;
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Content-Type': 'application/json'
    };

    try {
        const body = await request.json();
        const { name, email, phone, dob, position, capability, cvUrl } = body;

        const emailHTMLContent = `
        <div style="background-color: #f3f4f6; padding: 30px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border-top: 6px solid #d97706; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 25px;">
                <h2 style="color: #065f46; margin-top: 0; font-family: serif; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🕊️ NAYI SUBAH APPLICANT PROFILE REGISTRY</h2>
                <p style="font-size: 14px; color: #4b5563;">A new candidate application has been filed via the live hub deployment node.</p>
                
                <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 15px;">👤 CANDIDATE PROFILE INFO</h3>
                    <p style="margin: 4px 0; font-size: 14px;"><strong>Full Legal Name:</strong> ${name}</p>
                    <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 4px 0; font-size: 14px;"><strong>WhatsApp Line:</strong> ${phone}</p>
                    <p style="margin: 4px 0; font-size: 14px;"><strong>Date of Birth:</strong> ${dob}</p>
                </div>

                <div style="margin: 20px 0;">
                    <p style="margin: 4px 0; font-size: 14px;"><strong>Target Strategic Position:</strong></p>
                    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; color: #b45309; font-weight: bold; padding: 10px; border-radius: 6px; display: inline-block; font-size: 14px;">
                        🎯 ${position}
                    </div>
                </div>

                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                    <h4 style="margin: 0 0 8px 0; color: #374151; font-size: 13px; text-transform: uppercase;">Core Capability Statement:</h4>
                    <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6; font-style: italic;">"${capability}"</p>
                </div>

                <div style="text-align: center; margin: 25px 0;">
                    <a href="${cvUrl}" target="_blank" style="background-color: #ea580c; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 30px; border-radius: 8px; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.2);">
                        📂 Open & Evaluate Candidate CV File
                    </a>
                </div>
            </div>
        </div>`;

        // Pulls securely directly from Cloudflare environment dashboard settings
        const resendApiKey = 're_cq4W811S_AY3VuQqMuhWRsgiykRuufxSA';

        if (!resendApiKey) {
            return new Response(JSON.stringify({ success: false, error: "Missing RESEND_API_KEY Variable in Cloudflare Settings." }), { status: 500, headers });
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${resendApiKey.trim()}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                from: 'NayiSubah Portal <onboarding@resend.dev>',
                to: 'sherazsubhan961@gmail.com',
                subject: `🕊️ NAYI SUBAH CANDIDATE REGISTRATION: ${name}`,
                html: emailHTMLContent
            })
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
            return new Response(JSON.stringify({ success: false, error: resendData.message || "Resend Auth Failure" }), { status: 500, headers });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.toString() }), { status: 500, headers });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        }
    });
}
