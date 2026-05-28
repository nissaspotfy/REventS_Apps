import { Response } from 'express';
import { CopilotService } from '../services/copilot.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class CopilotController {
  static async generateDraft(req: AuthenticatedRequest, res: Response) {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        res.status(400).json({ error: 'A valid text prompt is required.' });
        return;
      }

      // Load all existing event titles to avoid creating duplicate events
      const { Event } = await import('../models/Event');
      const existingEvents = await Event.findAll({ attributes: ['title'] });
      const existingTitles = existingEvents.map(e => e.title);

      const draft = await CopilotService.generateEventDraft(prompt, existingTitles);
      res.status(200).json(draft);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async chat(req: AuthenticatedRequest, res: Response) {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'A valid text message is required.' });
        return;
      }

      // Load active events from the database to suggest them
      const { Event } = await import('../models/Event');
      const activeEvents = await Event.findAll({ where: { status: 'active' } });
      const eventsSummary = activeEvents.map(e => ({
        id: e.id,
        title: e.title,
        category: e.category,
        date: e.date,
        location: e.location,
        price: e.price,
        description: e.description
      }));

      const reply = await CopilotService.chatMatchmaker(message, history || [], eventsSummary);
      res.status(200).json({ reply });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async recommend(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { User } = await import('../models/User');
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      const userPreferences = user.preferences || {};
      const { Event } = await import('../models/Event');
      const activeEvents = await Event.findAll({ where: { status: 'active' } });
      const eventsSummary = activeEvents.map(e => ({
        id: e.id,
        title: e.title,
        category: e.category,
        date: e.date,
        location: e.location,
        price: e.price,
        description: e.description,
        type: e.type
      }));

      const recommendations = await CopilotService.recommendEvents(userPreferences, eventsSummary);
      res.status(200).json(recommendations);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
