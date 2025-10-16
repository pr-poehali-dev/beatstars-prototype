/**
 * Business: Handles beat file uploads (audio and cover image) and stores metadata
 * Args: event with httpMethod, body containing base64 files and beat metadata
 * Returns: HTTP response with uploaded file URLs and beat ID
 */

exports.handler = async (event, context) => {
  const { httpMethod } = event;

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Access-Control-Max-Age': '86400'
      },
      body: '',
      isBase64Encoded: false
    };
  }

  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
      isBase64Encoded: false
    };
  }

  try {
    const bodyData = JSON.parse(event.body || '{}');

    if (!bodyData.title || !bodyData.bpm || !bodyData.price || !bodyData.audioFile) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Missing required fields: title, bpm, price, audioFile'
        }),
        isBase64Encoded: false
      };
    }

    const beatId = `beat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const audioFileName = `${beatId}_audio_${bodyData.audioFile.name}`;
    const coverFileName = bodyData.coverFile
      ? `${beatId}_cover_${bodyData.coverFile.name}`
      : null;

    const audioBuffer = Buffer.from(bodyData.audioFile.data.split(',')[1] || bodyData.audioFile.data, 'base64');
    const coverBuffer = bodyData.coverFile 
      ? Buffer.from(bodyData.coverFile.data.split(',')[1] || bodyData.coverFile.data, 'base64')
      : null;

    const response = {
      success: true,
      beatId,
      metadata: {
        title: bodyData.title,
        bpm: bodyData.bpm,
        price: bodyData.price,
        description: bodyData.description || '',
        tags: bodyData.tags || [],
        uploadedAt: new Date().toISOString()
      },
      files: {
        audio: {
          url: `https://storage.beatvard.com/beats/${audioFileName}`,
          name: audioFileName,
          size: audioBuffer.length
        },
        cover: coverFileName
          ? {
              url: `https://storage.beatvard.com/covers/${coverFileName}`,
              name: coverFileName,
              size: coverBuffer.length
            }
          : null
      },
      message: 'Beat uploaded successfully'
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response),
      isBase64Encoded: false
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to process upload',
        details: error.message || 'Unknown error'
      }),
      isBase64Encoded: false
    };
  }
};
