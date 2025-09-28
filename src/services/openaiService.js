import openai from './openaiClient';

/**
 * Generates a chat completion response based on user input.
 * @param {string} userMessage - The user's input message.
 * @param {string} systemMessage - System instructions for the AI.
 * @returns {Promise<string>} The assistant's response.
 */
export async function getBasicChatCompletion(userMessage, systemMessage = 'You are a helpful Mexican tax assistant specialized in helping users with SAT refund processes and compliance.') {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      max_completion_tokens: 2000,
      reasoning_effort: 'medium',
      verbosity: 'medium',
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('Error in basic chat completion:', error);
    throw error;
  }
}

/**
 * Streams a chat completion response chunk by chunk.
 * @param {string} userMessage - The user's input message.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 * @param {string} systemMessage - System instructions for the AI.
 */
export async function getStreamingChatCompletion(userMessage, onChunk, systemMessage = 'You are a helpful Mexican tax assistant specialized in helping users with SAT refund processes and compliance.') {
  try {
    const stream = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      stream: true,
      reasoning_effort: 'minimal', // For faster streaming
    });

    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error in streaming chat completion:', error);
    throw error;
  }
}

/**
 * Analyzes tax documents and provides compliance insights.
 * @param {string} documentContent - The document content to analyze.
 * @param {string} documentType - Type of document (e.g., 'receipt', 'invoice', 'form').
 * @returns {Promise<Object>} Analysis results with compliance status.
 */
export async function analyzeTaxDocument(documentContent, documentType = 'general') {
  try {
    const systemMessage = `You are an expert Mexican tax compliance analyst. Analyze the provided document for SAT compliance, potential issues, and provide actionable recommendations. Focus on Mexican tax regulations and SAT requirements.`;
    
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemMessage },
        { 
          role: 'user', 
          content: `Analyze this ${documentType} document for Mexican tax compliance:\n\n${documentContent}` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'tax_document_analysis',
          schema: {
            type: 'object',
            properties: {
              compliance_status: { 
                type: 'string', 
                enum: ['compliant', 'non_compliant', 'needs_review'],
                description: 'Overall compliance status' 
              },
              issues_found: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'List of compliance issues found'
              },
              recommendations: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Actionable recommendations to fix issues'
              },
              confidence: { 
                type: 'number', 
                minimum: 0, 
                maximum: 1,
                description: 'Confidence level in the analysis (0-1)'
              },
              required_actions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    action: { type: 'string' },
                    priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                    deadline: { type: 'string' }
                  },
                  required: ['action', 'priority']
                }
              }
            },
            required: ['compliance_status', 'issues_found', 'recommendations', 'confidence'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'high',
      verbosity: 'high',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error analyzing tax document:', error);
    throw error;
  }
}

/**
 * Generates refund application assistance based on user information.
 * @param {Object} userInfo - User's tax information.
 * @returns {Promise<Object>} Refund assistance with guidance.
 */
export async function generateRefundAssistance(userInfo) {
  try {
    const systemMessage = `You are a Mexican tax refund specialist. Help users understand their refund eligibility, required documents, and provide step-by-step guidance for SAT refund applications. Always reference current Mexican tax laws and SAT procedures.`;
    
    const userMessage = `Help me with my Mexican tax refund application. Here's my information: ${JSON.stringify(userInfo, null, 2)}`;
    
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'refund_assistance',
          schema: {
            type: 'object',
            properties: {
              eligibility_status: { 
                type: 'string', 
                enum: ['eligible', 'not_eligible', 'needs_verification'],
                description: 'Refund eligibility status' 
              },
              refund_estimate: { 
                type: 'number',
                description: 'Estimated refund amount in MXN'
              },
              required_documents: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'List of required documents for the refund'
              },
              step_by_step_guide: { 
                type: 'array', 
                items: { 
                  type: 'object',
                  properties: {
                    step: { type: 'number' },
                    description: { type: 'string' },
                    estimated_time: { type: 'string' }
                  },
                  required: ['step', 'description']
                },
                description: 'Step-by-step refund application guide'
              },
              potential_issues: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Potential issues that might affect the refund'
              },
              tips: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Helpful tips for a successful refund application'
              }
            },
            required: ['eligibility_status', 'required_documents', 'step_by_step_guide'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'high',
      verbosity: 'high',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating refund assistance:', error);
    throw error;
  }
}

/**
 * Moderates text content for policy violations.
 * @param {string} text - The text to moderate.
 * @returns {Promise<object>} Moderation results.
 */
export async function moderateText(text) {
  try {
    const response = await openai?.moderations?.create({
      model: 'text-moderation-latest',
      input: text,
    });

    return response?.results?.[0];
  } catch (error) {
    console.error('Error moderating text:', error);
    throw error;
  }
}

/**
 * Generates personalized recommendations based on user data and tax situation.
 * @param {Object} userProfile - User's profile and tax information.
 * @returns {Promise<Object>} Personalized recommendations.
 */
export async function generatePersonalizedRecommendations(userProfile) {
  try {
    const systemMessage = `You are a Mexican tax optimization expert. Analyze the user's profile and provide personalized recommendations for tax planning, refund optimization, and compliance improvement. Focus on legitimate strategies within Mexican tax law.`;
    
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemMessage },
        { 
          role: 'user', 
          content: `Generate personalized tax recommendations for this user profile: ${JSON.stringify(userProfile, null, 2)}` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'personalized_recommendations',
          schema: {
            type: 'object',
            properties: {
              tax_optimization: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Tax optimization strategies'
              },
              refund_opportunities: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Potential refund opportunities'
              },
              compliance_improvements: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Ways to improve compliance'
              },
              deadlines_to_watch: { 
                type: 'array', 
                items: {
                  type: 'object',
                  properties: {
                    deadline: { type: 'string' },
                    description: { type: 'string' },
                    priority: { type: 'string', enum: ['high', 'medium', 'low'] }
                  },
                  required: ['deadline', 'description', 'priority']
                }
              },
              estimated_savings: { 
                type: 'number',
                description: 'Estimated annual tax savings in MXN'
              }
            },
            required: ['tax_optimization', 'refund_opportunities', 'compliance_improvements'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'high',
      verbosity: 'medium',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    throw error;
  }
}

/**
 * Error handler for OpenAI API errors
 * @param {Error} error - The error object
 * @returns {Object} Formatted error response
 */
export function handleOpenAIError(error) {
  console.error('OpenAI API Error:', error);
  
  if (error?.response?.status === 401) {
    return {
      error: 'API key is invalid or missing',
      suggestion: 'Please check your VITE_OPENAI_API_KEY environment variable'
    };
  } else if (error?.response?.status === 429) {
    return {
      error: 'API rate limit exceeded',
      suggestion: 'Please try again in a few minutes'
    };
  } else if (error?.response?.status === 500) {
    return {
      error: 'OpenAI service is temporarily unavailable',
      suggestion: 'Please try again later'
    };
  } else {
    return {
      error: 'An unexpected error occurred',
      suggestion: 'Please try again or contact support'
    };
  }
}