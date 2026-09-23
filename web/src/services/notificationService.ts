import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types';

export const notificationService = {
  /**
   * Obtiene las notificaciones del usuario, ordenadas de más recientes a antiguas.
   */
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50); // Mantenemos las últimas 50 para no saturar

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    return data as Notification[];
  },

  /**
   * Marca una notificación específica como leída.
   */
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Marca todas las notificaciones de un usuario como leídas.
   */
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};
