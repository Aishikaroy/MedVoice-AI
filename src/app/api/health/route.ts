import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${backendUrl}/`, { 
            method: 'GET',
            cache: 'no-store'
        });
        
        if (response.ok) {
            return NextResponse.json({ status: 'connected' });
        }
        return NextResponse.json({ status: 'disconnected' }, { status: 503 });
    } catch (error) {
        return NextResponse.json({ status: 'error', message: 'Backend unreachable' }, { status: 503 });
    }
}
