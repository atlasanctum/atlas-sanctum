import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api/client';

// Auth Hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiService.auth.login(email, password),
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: ({ email, password, displayName }: { email: string; password: string; displayName?: string }) =>
      apiService.auth.signup(email, password, displayName),
  });
};

export const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiService.auth.getCurrentUser(),
    enabled,
  });
};

// Marketplace Hooks
export const useRIUMarket = () => {
  return useQuery({
    queryKey: ['riumMarket'],
    queryFn: () => apiService.marketplace.getRIUMarket(),
  });
};

export const useRIUListings = (page = 1, size = 20) => {
  return useQuery({
    queryKey: ['riuListings', page, size],
    queryFn: () => apiService.marketplace.getRIUListings(page, size),
  });
};

export const usePurchaseRIU = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ riuId, buyerId, quantity }: { riuId: string; buyerId: string; quantity: number }) =>
      apiService.marketplace.purchaseRIUs(riuId, buyerId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riuListings'] });
      queryClient.invalidateQueries({ queryKey: ['riumMarket'] });
    },
  });
};

export const useBonds = () => {
  return useQuery({
    queryKey: ['bonds'],
    queryFn: () => apiService.marketplace.getBonds(),
  });
};

export const usePurchaseBond = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bondId, buyerId, amount }: { bondId: string; buyerId: string; amount: number }) =>
      apiService.marketplace.purchaseBond(bondId, buyerId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonds'] });
    },
  });
};

export const useTradingVolume = () => {
  return useQuery({
    queryKey: ['tradingVolume'],
    queryFn: () => apiService.marketplace.getTradingVolume(),
  });
};

export const useTransactionHistory = (userId?: string) => {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => apiService.marketplace.getTransactionHistory(userId),
    enabled: !!userId,
  });
};

// Projects Hooks
export const useProjects = (page = 1, size = 20, status?: string) => {
  return useQuery({
    queryKey: ['projects', page, size, status],
    queryFn: () => apiService.projects.getProjects(page, size, status),
  });
};

export const useProject = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => apiService.projects.getProjectById(id),
    enabled: !!id && enabled,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.projects.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiService.projects.updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useProjectStats = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['projectStats', id],
    queryFn: () => apiService.projects.getProjectStats(id),
    enabled: !!id && enabled,
  });
};

export const useApproveProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      apiService.projects.approveProject(id, notes),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useRejectProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiService.projects.rejectProject(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Measurements Hooks
export const useProjectMeasurements = (projectId: string, page = 1) => {
  return useQuery({
    queryKey: ['measurements', projectId, page],
    queryFn: () => apiService.measurements.getProjectMeasurements(projectId, page),
    enabled: !!projectId,
  });
};

export const useRecordMeasurement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.measurements.recordMeasurement(data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['measurements', projectId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
};

export const useMeasurement = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['measurement', id],
    queryFn: () => apiService.measurements.getMeasurement(id),
    enabled: !!id && enabled,
  });
};

export const useAnomalies = (projectId?: string) => {
  return useQuery({
    queryKey: ['anomalies', projectId],
    queryFn: () => apiService.measurements.getAnomalies(projectId),
  });
};

export const useMeasurementTrends = (projectId: string, days = 365) => {
  return useQuery({
    queryKey: ['trends', projectId, days],
    queryFn: () => apiService.measurements.getTrends(projectId, days),
    enabled: !!projectId,
  });
};

export const useBioregionMeasurements = (bioregionId: string) => {
  return useQuery({
    queryKey: ['bioregionMeasurements', bioregionId],
    queryFn: () => apiService.measurements.getBioregionMeasurements(bioregionId),
    enabled: !!bioregionId,
  });
};
