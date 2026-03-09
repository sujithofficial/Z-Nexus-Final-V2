import fs from 'fs';
import { Buffer } from 'buffer';

async function runTest() {
    try {
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful');

        // Simple multipart body manually
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const body = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="name"',
            '',
            'Instagram Test',
            `--${boundary}--`,
            ''
        ].join('\r\n');

        console.log('Attempting update with no file...');
        const updateRes = await fetch('http://localhost:5000/api/contacts/69aeae69abf1d04aef74f963', {
            method: 'PUT',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Authorization': `Bearer ${token}`
            },
            body: body
        });

        const updateData = await updateRes.json();
        console.log('Status:', updateRes.status);
        console.log('Update result:', updateData);
    } catch (e) {
        console.error('Update failed:', e.message);
    } finally {
        process.exit();
    }
}
runTest();
