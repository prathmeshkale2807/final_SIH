import { Farmer } from './server/models/Farmer.js';
import { connectDB } from './server/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const clean = async () => {
    await connectDB();
    console.log('DB connected');
    const res = await Farmer.find({});
    console.log('ALL FARMERS:', JSON.stringify(res, null, 2));
    process.exit(0);
};

clean().catch(console.error);
