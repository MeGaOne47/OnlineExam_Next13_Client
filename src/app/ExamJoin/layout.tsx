
export const metadata = {
  title: 'Exam list',
  description: 'Generated by Hỏi dân it',
}

export default function RootLayout({
  children,
}:{
    children: React.ReactNode
  }) 
{
  return (
    <>
        {children}
    </>
  )
}