'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PortfolioForm } from '@/components/admin/portfolio/PortfolioForm';
import { usePortfolio } from '@/hooks/usePortfolio';
import type { PortfolioItem } from '@/types/portfolio';

export default function EditPortfolioPage() {
  const params = useParams();
  const id = params?.id as string;
  const { 
    portfolio, 
    loading, 
    saving, 
    error, 
    success, 
    fetchPortfolio, 
    updatePortfolio, 
    deletePortfolio 
  } = usePortfolio(id);

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const handleSubmit = async (data: PortfolioItem) => {
    console.log('Submitting portfolio data:', data);
    await updatePortfolio(data);
  };

  const handleDelete = async () => {
    await deletePortfolio();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!portfolio) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="p-4 border border-red-500 rounded-lg bg-red-500/10">
            <p className="text-red-400">Portfolio item not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <Link href="/admin/portfolio" className="inline-flex items-center gap-2 mb-6 text-gray-400 transition-colors hover:text-purple-400">
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">Edit Portfolio Item</h1>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 border border-red-500 rounded-lg bg-red-500/10">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-4 mb-6 border border-green-500 rounded-lg bg-green-500/10">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <PortfolioForm
          initialData={portfolio}
          onSubmit={handleSubmit}
          isLoading={saving}
          mode="edit"
        />
      </div>
    </AdminLayout>
  );
}
