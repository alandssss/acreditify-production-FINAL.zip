import { supabase } from '../lib/supabase';

export const documentService = {
  // Upload document to storage and create database record
  async uploadDocument(userId, refundRequestId, file, documentType) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/documents/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase?.storage
        ?.from('tax-documents')
        ?.upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record in database
      const { data: docData, error: docError } = await supabase
        ?.from('documents')
        ?.insert({
          refund_request_id: refundRequestId,
          user_id: userId,
          file_name: file?.name,
          file_size: file?.size,
          file_type: file?.type,
          document_type: documentType,
          document_status: 'validado', // Simplified - would normally be 'subiendo' then validated
          file_path: filePath
        })
        ?.select()
        ?.single();

      if (docError) throw docError;

      return { data: docData, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Get documents for a refund request
  async getRefundDocuments(refundRequestId) {
    try {
      const { data, error } = await supabase
        ?.from('documents')
        ?.select('*')
        ?.eq('refund_request_id', refundRequestId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      // Get signed URLs for each document
      const documentsWithUrls = await Promise.all(
        (data || [])?.map(async (doc) => {
          if (doc?.file_path) {
            const { data: urlData } = await supabase?.storage
              ?.from('tax-documents')
              ?.createSignedUrl(doc?.file_path, 3600); // 1 hour expiry

            return {
              ...doc,
              signedUrl: urlData?.signedUrl,
              downloadUrl: urlData?.signedUrl
            };
          }
          return doc;
        })
      );

      return documentsWithUrls;
    } catch (error) {
      console.error('Error fetching refund documents:', error);
      return [];
    }
  },

  // Get all user documents
  async getUserDocuments(userId, folder = 'documents') {
    try {
      // List files in user's folder
      const { data: files, error: listError } = await supabase?.storage
        ?.from('tax-documents')
        ?.list(`${userId}/${folder}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) throw listError;

      // Generate signed URLs for each file
      const filesWithUrls = await Promise.all(
        (files || [])?.map(async (file) => {
          const filePath = `${userId}/${folder}/${file?.name}`;
          const { data: urlData } = await supabase?.storage
            ?.from('tax-documents')
            ?.createSignedUrl(filePath, 3600);

          return {
            ...file,
            fullPath: filePath,
            signedUrl: urlData?.signedUrl,
            downloadUrl: urlData?.signedUrl
          };
        })
      );

      return filesWithUrls?.filter(file => file?.signedUrl) || [];
    } catch (error) {
      console.error('Error getting user documents:', error);
      return [];
    }
  },

  // Delete document
  async deleteDocument(documentId, userId) {
    try {
      // Get document info first
      const { data: doc, error: fetchError } = await supabase
        ?.from('documents')
        ?.select('file_path')
        ?.eq('id', documentId)
        ?.eq('user_id', userId)
        ?.single();

      if (fetchError) throw fetchError;

      // Delete from storage
      if (doc?.file_path) {
        await supabase?.storage
          ?.from('tax-documents')
          ?.remove([doc?.file_path]);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        ?.from('documents')
        ?.delete()
        ?.eq('id', documentId)
        ?.eq('user_id', userId);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (error) {
      return { error: error?.message };
    }
  },

  // Update document status
  async updateDocumentStatus(documentId, newStatus, validationNotes = '') {
    try {
      const { data, error } = await supabase
        ?.from('documents')
        ?.update({ 
          document_status: newStatus,
          validation_notes: validationNotes 
        })
        ?.eq('id', documentId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error?.message };
    }
  },

  // Download document
  async downloadDocument(filePath) {
    try {
      const { data, error } = await supabase?.storage
        ?.from('tax-documents')
        ?.download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filePath?.split('/')?.pop() || 'document';
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error downloading document:', error);
      return { error: error?.message };
    }
  },

  // Get document type label
  getDocumentTypeLabel(type) {
    const labels = {
      'cfdi': 'CFDI',
      'recibo': 'Recibo',
      'comprobante': 'Comprobante',
      'anexo': 'Anexo',
      'identificacion': 'Identificación',
      'otro': 'Otro'
    };
    return labels?.[type] || type;
  },

  // Get document status label
  getDocumentStatusLabel(status) {
    const labels = {
      'subiendo': 'Subiendo',
      'validado': 'Validado',
      'rechazado': 'Rechazado',
      'procesando': 'Procesando'
    };
    return labels?.[status] || status;
  }
};