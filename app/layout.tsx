import '@/app/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | SJSUL',
    default: 'San José State University Library Management System',
  },
  description: 'The San José State University Library Management System.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} bg-background-light antialiased`}>
        {children}
      </body>
    </html>
  );
}
