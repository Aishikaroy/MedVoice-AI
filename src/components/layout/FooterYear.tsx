'use client';

// Tiny client component so new Date() is evaluated in the browser,
// never during static prerendering.
export default function FooterYear() {
    return <>{new Date().getFullYear()}</>;
}
