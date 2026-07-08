import { Request, Response, NextFunction } from 'express';

// @desc    Chat with AI financial advisor (Replaced with Random Advice API)
// @route   POST /api/chat
// @access  Private
export const chatWithAI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch a random piece of advice from the public Advice Slip API
    const response = await fetch('https://api.adviceslip.com/advice');
    
    if (!response.ok) {
      throw new Error('Failed to fetch advice from public API');
    }

    const data = await response.json();
    const adviceText = data.slip.advice;

    res.status(200).json({ reply: adviceText });
  } catch (error: any) {
    console.error('=== CHAT API ERROR ===');
    console.error(error?.message || error);
    console.error('========================');
    next(error);
  }
};
