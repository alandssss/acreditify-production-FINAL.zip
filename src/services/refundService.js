import { supabase } from '../lib/supabase';

export const refundService = {
  // Get all refund requests for the current user
  async getUserRefunds(userId) {
    try {
      const { data, error } = await supabase
        ?.from('refund_requests')
        ?.select(`
          *,
          documents:documents(count)
        `)
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the expected format
      return data?.map(refund => ({
        id: refund?.id,
        folio: refund?.folio,
        type: this.getRefundTypeLabel(refund?.refund_type),
        amount: refund?.requested_amount || 0,
        status: this.getStatusLabel(refund?.status),
        progress: this.calculateProgress(refund?.status),
        estimatedCompletion: refund?.estimated_completion_date,
        documents: refund?.documents?.[0]?.count || 0,
        validDocuments: refund?.documents?.[0]?.count || 0, // Simplified for now
        createdAt: refund?.created_at,
        refundType: refund?.refund_type,
        taxYear: refund?.tax_year,
        taxPeriod: refund?.tax_period
      })) || [];
    } catch (error) {
      console.error('Error fetching user refunds:', error);
      return [];
    }
  },

  // Create a new refund request
  async createRefundRequest(userId, refundData) {
    try {
      // Generate unique folio
      const { data: folioData } = await supabase?.rpc('generate_folio');
      
      const { data, error } = await supabase
        ?.from('refund_requests')
        ?.insert({
          folio: folioData,
          user_id: userId,
          refund_type: refundData?.refundType,
          tax_year: refundData?.taxYear,
          tax_period: refundData?.taxPeriod,
          requested_amount: refundData?.requestedAmount,
          status: 'borrador'
        })
        ?.select()
        ?.single();

      if (error) throw error;

      // Create activity entry
      await this.addActivity(data?.id, userId, 'solicitud_creada', 'Nueva solicitud de devolución creada');

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Update refund request status
  async updateRefundStatus(refundId, newStatus, userId) {
    try {
      const { data, error } = await supabase
        ?.from('refund_requests')
        ?.update({ 
          status: newStatus,
          ...(newStatus === 'enviado' && { submission_date: new Date()?.toISOString() }),
          ...(newStatus === 'completado' && { completion_date: new Date()?.toISOString() })
        })
        ?.eq('id', refundId)
        ?.eq('user_id', userId)
        ?.select()
        ?.single();

      if (error) throw error;

      // Add activity
      await this.addActivity(refundId, userId, newStatus, `Estado actualizado a: ${this.getStatusLabel(newStatus)}`);

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Add activity to timeline
  async addActivity(refundRequestId, userId, activityType, description, metadata = {}) {
    try {
      const { data, error } = await supabase
        ?.from('activity_timeline')
        ?.insert({
          refund_request_id: refundRequestId,
          user_id: userId,
          activity_type: activityType,
          description,
          metadata
        });

      return { data, error };
    } catch (error) {
      console.error('Error adding activity:', error);
      return { data: null, error: error?.message };
    }
  },

  // Get activity timeline for a refund request
  async getRefundActivity(refundRequestId) {
    try {
      const { data, error } = await supabase
        ?.from('activity_timeline')
        ?.select('*')
        ?.eq('refund_request_id', refundRequestId)
        ?.order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching refund activity:', error);
      return [];
    }
  },

  // Get refund metrics/summary
  async getRefundMetrics(userId) {
    try {
      const { data: refunds, error } = await supabase
        ?.from('refund_requests')
        ?.select('requested_amount, approved_amount, status')
        ?.eq('user_id', userId);

      if (error) throw error;

      const metrics = refunds?.reduce((acc, refund) => {
        acc.totalRequested += refund?.requested_amount || 0;
        acc.totalApproved += refund?.approved_amount || 0;
        
        if (refund?.status === 'en_proceso' || refund?.status === 'enviado') {
          acc.activeRequests += 1;
        }
        
        return acc;
      }, {
        totalRequested: 0,
        totalApproved: 0,
        activeRequests: 0,
        averageTime: 28 // Default value - could be calculated from actual data
      });

      return metrics;
    } catch (error) {
      console.error('Error fetching refund metrics:', error);
      return {
        totalRequested: 0,
        totalApproved: 0,
        activeRequests: 0,
        averageTime: 0
      };
    }
  },

  // Helper functions
  getRefundTypeLabel(type) {
    const labels = {
      'iva': 'Devolución IVA',
      'isr': 'Devolución ISR',
      'salarios': 'Devolución Salarios',
      'otros': 'Otros'
    };
    return labels?.[type] || type;
  },

  getStatusLabel(status) {
    const labels = {
      'borrador': 'Borrador',
      'enviado': 'Enviado',
      'en_proceso': 'En proceso',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado',
      'completado': 'Completado'
    };
    return labels?.[status] || status;
  },

  calculateProgress(status) {
    const progressMap = {
      'borrador': 10,
      'enviado': 25,
      'en_proceso': 65,
      'aprobado': 90,
      'completado': 100,
      'rechazado': 0
    };
    return progressMap?.[status] || 0;
  }
};