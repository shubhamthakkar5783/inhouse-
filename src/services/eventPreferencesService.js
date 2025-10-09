import { supabase } from '../lib/supabaseClient';

export const eventPreferencesService = {
  async savePreferences(preferences) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const existingPreferences = await this.getLatestPreferences();

      let result;
      if (existingPreferences) {
        const { data, error } = await supabase
          .from('event_preferences')
          .update({
            venue: preferences.venue,
            number_of_people: preferences.numberOfPeople,
            budget: preferences.budget,
            event_date: preferences.eventDate,
            event_time: preferences.eventTime,
          })
          .eq('id', existingPreferences.id)
          .select()
          .maybeSingle();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('event_preferences')
          .insert({
            user_id: user.id,
            venue: preferences.venue,
            number_of_people: preferences.numberOfPeople,
            budget: preferences.budget,
            event_date: preferences.eventDate,
            event_time: preferences.eventTime,
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        result = data;
      }

      return result;
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  },

  async getLatestPreferences() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('event_preferences')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        venue: data.venue,
        numberOfPeople: data.number_of_people,
        budget: data.budget,
        eventDate: data.event_date,
        eventTime: data.event_time,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  },

  async getAllPreferences() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('event_preferences')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        venue: item.venue,
        numberOfPeople: item.number_of_people,
        budget: item.budget,
        eventDate: item.event_date,
        eventTime: item.event_time,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching all preferences:', error);
      throw error;
    }
  },

  async deletePreferences(id) {
    try {
      const { error } = await supabase
        .from('event_preferences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting preferences:', error);
      throw error;
    }
  },
};
