import { useState, useCallback } from 'react';
import { 
  getBasicChatCompletion, 
  getStreamingChatCompletion,
  analyzeTaxDocument,
  generateRefundAssistance,
  generatePersonalizedRecommendations,
  moderateText,
  handleOpenAIError
} from '../services/openaiService';

/**
 * Custom hook for OpenAI integration
 * @returns {Object} OpenAI hook functions and state
 */
export const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
  }, []);

  /**
   * Get basic chat completion
   */
  const getChatResponse = useCallback(async (userMessage, systemMessage) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getBasicChatCompletion(userMessage, systemMessage);
      setResponse(result);
      return result;
    } catch (err) {
      const errorResponse = handleOpenAIError(err);
      setError(errorResponse);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get streaming chat completion
   */
  const getStreamingResponse = useCallback(async (userMessage, onChunk, systemMessage) => {
    setLoading(true);
    setError(null);
    setResponse('');
    
    try {
      await getStreamingChatCompletion(
        userMessage, 
        (chunk) => {
          setResponse(prev => (prev || '') + chunk);
          onChunk?.(chunk);
        },
        systemMessage
      );
    } catch (err) {
      const errorResponse = handleOpenAIError(err);
      setError(errorResponse);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Analyze tax documents
   */
  const analyzeDocument = useCallback(async (documentContent, documentType) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeTaxDocument(documentContent, documentType);
      setResponse(result);
      return result;
    } catch (err) {
      const errorResponse = handleOpenAIError(err);
      setError(errorResponse);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate refund assistance
   */
  const getRefundAssistance = useCallback(async (userInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateRefundAssistance(userInfo);
      setResponse(result);
      return result;
    } catch (err) {
      const errorResponse = handleOpenAIError(err);
      setError(errorResponse);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate personalized recommendations
   */
  const getPersonalizedRecommendations = useCallback(async (userProfile) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generatePersonalizedRecommendations(userProfile);
      setResponse(result);
      return result;
    } catch (err) {
      const errorResponse = handleOpenAIError(err);
      setError(errorResponse);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Moderate text content
   */
  const moderateContent = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await moderateText(text);
      setResponse(result);
      return result;
    } catch (err) {
      const errorResponse = handleOpenAIError(err);
      setError(errorResponse);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    response,
    clearError,
    clearResponse,
    getChatResponse,
    getStreamingResponse,
    analyzeDocument,
    getRefundAssistance,
    getPersonalizedRecommendations,
    moderateContent,
  };
};

export default useOpenAI;