import { Response } from 'express';
import { EventService } from '../services/event.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class EventController {
  static async getEvents(req: AuthenticatedRequest, res: Response) {
    try {
      const { category, search, location } = req.query;
      const events = await EventService.getEvents({
        category: category as string,
        search: search as string,
        location: location as string
      });
      
      const currentUserId = req.user?.userId;
      const filteredEvents = events.filter(event => {
        if (event.isPublic !== false) {
          return true;
        }
        return currentUserId && event.organizerId === currentUserId;
      });

      res.status(200).json(filteredEvents);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getEventById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid event ID.' });
        return;
      }
      const event = await EventService.getEventById(id);
      res.status(200).json(event);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  static async createEvent(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const { User } = await import('../models/User');
      const user = await User.findByPk(userId);
      const organizerId = user?.preferences?.joinedTeamOf || userId;

      const { 
        title, 
        category, 
        date, 
        location, 
        price, 
        image, 
        isTrending, 
        description, 
        type, 
        ticketType, 
        status,
        fullDescription,
        capacity,
        onlineLink,
        ticketName,
        provideCertificate,
        certificateReleased,
        certificateTemplateUrl,
        isExternal,
        externalUrl,
        externalProvider
      } = req.body;
      if (!title || !category || !date || !location || !price) {
        res.status(400).json({ error: 'Missing required event fields (title, category, date, location, price).' });
        return;
      }

      const newEvent = await EventService.createEvent(organizerId, {
        title,
        category,
        date,
        location,
        price,
        image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=450&q=70',
        isTrending: !!isTrending,
        description: description || '',
        type: type || 'offline',
        ticketType: ticketType || 'paid',
        status: status || 'active',
        fullDescription,
        capacity: capacity ? parseInt(capacity, 10) : undefined,
        onlineLink,
        ticketName,
        provideCertificate: provideCertificate !== undefined ? !!provideCertificate : false,
        certificateReleased: certificateReleased !== undefined ? !!certificateReleased : false,
        certificateTemplateUrl,
        isExternal: isExternal !== undefined ? !!isExternal : false,
        externalUrl,
        externalProvider
      });

      res.status(201).json(newEvent);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateEvent(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = parseInt(req.params.id, 10);
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid event ID.' });
        return;
      }

      const { User } = await import('../models/User');
      const user = await User.findByPk(userId);
      const organizerId = user?.preferences?.joinedTeamOf || userId;

      const updated = await EventService.updateEvent(id, organizerId, req.body);
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteEvent(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = parseInt(req.params.id, 10);
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid event ID.' });
        return;
      }

      const { User } = await import('../models/User');
      const user = await User.findByPk(userId);
      const organizerId = user?.preferences?.joinedTeamOf || userId;

      const result = await EventService.deleteEvent(id, organizerId);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async distributeCertificates(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = parseInt(req.params.id, 10);
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid event ID.' });
        return;
      }

      const { User } = await import('../models/User');
      const user = await User.findByPk(userId);
      const organizerId = user?.preferences?.joinedTeamOf || userId;

      const hostUrl = `${req.protocol}://${req.get('host')}`;

      const result = await EventService.distributeCertificates(id, organizerId, hostUrl);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
