'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getPendingCertifications,
  approveCertification,
  rejectCertification,
} from '@/lib/api/certifications';
import type {
  Certification,
  CreateCertificationDto,
  UpdateCertificationDto,
} from '@/types';

/**
 * Hook to fetch current mentor's certifications
 */
export function useCertifications() {
  return useQuery({
    queryKey: ['certifications'],
    queryFn: getCertifications,
  });
}

/**
 * Hook to create a new certification
 */
export function useCreateCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, file }: { data: CreateCertificationDto; file: File }) =>
      createCertification(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification ajoutée. En attente de vérification.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de l\'ajout de la certification');
    },
  });
}

/**
 * Hook to update a certification
 */
export function useUpdateCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      file,
    }: {
      id: string;
      data: UpdateCertificationDto;
      file?: File;
    }) => updateCertification(id, data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification mise à jour');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    },
  });
}

/**
 * Hook to delete a certification
 */
export function useDeleteCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification supprimée');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression');
    },
  });
}

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * Hook to fetch pending certifications (admin only)
 */
export function usePendingCertifications() {
  return useQuery({
    queryKey: ['certifications', 'pending'],
    queryFn: getPendingCertifications,
  });
}

/**
 * Hook to approve a certification (admin only)
 */
export function useApproveCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification approuvée');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de l\'approbation');
    },
  });
}

/**
 * Hook to reject a certification (admin only)
 */
export function useRejectCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectCertification(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification rejetée');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors du rejet');
    },
  });
}
