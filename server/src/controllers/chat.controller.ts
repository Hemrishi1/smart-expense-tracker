import { Request, Response, NextFunction } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Expense from '../models/expense.model';
import Income from '../models/income.model';
import Budget from '../models/budget.model';

// @desc    Chat with AI financial advisor
// @route   POST /api/chat
// @access  Private
export const chatWithAI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500);
      throw new Error('AI service is not configured. Please add GEMINI_API_KEY.');
    }

    const { message, history } = req.body;
    const userId = (req as any).user._id;

    // Fetch user's financial data for context
    const [expenses, incomes, budgets] = await Promise.all([
      Expense.find({ user: userId }).sort({ date: -1 }).limit(20),
      Income.find({ user: userId }).sort({ date: -1 }).limit(10),
      Budget.find({ user: userId }),
    ]);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const topCategories = expenses.reduce((acc: Record<string, number>, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const financialContext = `
You are SmartX AI, a personal financial advisor integrated into a Smart Expense Tracker app.
You have access to the user's real financial data. Be helpful, concise, and personalized.

USER'S CURRENT FINANCIAL SNAPSHOT:
- Total Expenses (last 20 transactions): $${totalExpenses.toFixed(2)}
- Total Income (last 10 entries): $${totalIncome.toFixed(2)}
- Net Balance: $${(totalIncome - totalExpenses).toFixed(2)}
- Top Spending Categories: ${Object.entries(topCategories).sort((a,b) => b[1]-a[1]).slice(0,5).map(([cat, amt]) => `${cat}: $${(amt as number).toFixed(2)}`).join(', ')}
- Active Budgets: ${budgets.length} budget(s) set
- Recent Expenses: ${expenses.slice(0,5).map(e => `${e.description} ($${e.amount}, ${e.category})`).join('; ')}

Answer questions about their finances, give saving tips, analyze spending patterns, and provide budgeting advice. 
If asked something unrelated to finance, politely redirect to financial topics.
Keep responses friendly, concise (under 200 words), and actionable.
    `.trim();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: financialContext,
    });

    // Build chat history
    const chatHistory = (history || []).map((msg: { role: string; text: string }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText });
  } catch (error) {
    next(error);
  }
};
