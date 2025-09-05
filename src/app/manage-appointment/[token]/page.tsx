import ManageAppointmentClient from './page-client'

export default async function ManageAppointmentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <ManageAppointmentClient token={token} />
}