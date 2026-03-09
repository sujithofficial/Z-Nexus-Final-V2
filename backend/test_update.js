
import mongoose from 'mongoose';
import { updateContact } from './controllers/contactController.js';
import dotenv from 'dotenv';
import Contact from './models/Contact.js';

dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const id = '69aeae69abf1d04aef74f963';
        const req = {
            params: { id },
            body: { name: 'Updated Name', link: 'https://updated.com' },
            file: null
        };

        const res = {
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                console.log('Response Status:', this.statusCode || 200);
                console.log('Response Data:', JSON.stringify(data, null, 2));
                return this;
            }
        };

        await updateContact(req, res);
        process.exit(0);
    } catch (error) {
        console.error('Test Error:', error);
        process.exit(1);
    }
}

test();
