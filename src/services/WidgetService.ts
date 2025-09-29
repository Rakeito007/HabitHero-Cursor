import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabitStore } from '../state/habitStore';

export interface WidgetHabitData {
  id: string;
  name: string;
  icon: string;
  color: string;
  currentStreak: number;
  completionRate: number;
  isCompletedToday: boolean;
}

class WidgetService {
  private static instance: WidgetService;
  private readonly WIDGET_DATA_KEY = 'widget_habits_data';
  private readonly APP_GROUP_ID = 'group.com.vibecode.habithero';

  static getInstance(): WidgetService {
    if (!WidgetService.instance) {
      WidgetService.instance = new WidgetService();
    }
    return WidgetService.instance;
  }

  // Update widget data when habits change
  async updateWidgetData(): Promise<void> {
    try {
      const { habits, entries } = useHabitStore.getState();
      const activeHabits = habits.filter(habit => !habit.archived);
      const today = new Date().toISOString().split('T')[0];
      
      const widgetData: WidgetHabitData[] = activeHabits.map(habit => {
        const stats = useHabitStore.getState().getHabitStats(habit.id);
        const todayEntries = entries.filter(e => e.habitId === habit.id && e.date === today);
        const isCompletedToday = todayEntries.some(e => e.completed);
        
        return {
          id: habit.id,
          name: habit.name,
          icon: this.mapIconName(habit.icon),
          color: habit.color,
          currentStreak: stats.currentStreak,
          completionRate: stats.completionRate,
          isCompletedToday
        };
      });

      // Store in AsyncStorage for the app
      await AsyncStorage.setItem(this.WIDGET_DATA_KEY, JSON.stringify(widgetData));
      
      // In a real implementation, you would also store this in the App Group
      // for the widget extension to access
      console.log('✅ Widget data updated:', widgetData.length, 'habits');
      
    } catch (error) {
      console.error('❌ Failed to update widget data:', error);
    }
  }

  // Get widget data
  async getWidgetData(): Promise<WidgetHabitData[]> {
    try {
      const data = await AsyncStorage.getItem(this.WIDGET_DATA_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Failed to get widget data:', error);
      return [];
    }
  }

  // Handle habit completion from widget
  async handleWidgetCompletion(habitId: string): Promise<void> {
    try {
      const { completeHabit } = useHabitStore.getState();
      const today = new Date().toISOString().split('T')[0];
      
      // Complete the habit for today
      completeHabit(habitId, today);
      
      // Update widget data
      await this.updateWidgetData();
      
      console.log('✅ Habit completed from widget:', habitId);
      
    } catch (error) {
      console.error('❌ Failed to handle widget completion:', error);
    }
  }

  // Map React Native icon names to SF Symbols
  private mapIconName(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      'star-outline': 'star',
      'fitness-outline': 'figure.strengthtraining.traditional',
      'water-outline': 'drop',
      'book-outline': 'book',
      'musical-notes-outline': 'music.note',
      'bed-outline': 'bed.double',
      'restaurant-outline': 'fork.knife',
      'heart-outline': 'heart',
      'leaf-outline': 'leaf',
      'barbell-outline': 'dumbbell',
      'walk-outline': 'figure.walk',
      'bicycle-outline': 'bicycle',
      'car-outline': 'car',
      'airplane-outline': 'airplane',
      'phone-portrait-outline': 'phone',
      'laptop-outline': 'laptopcomputer',
      'camera-outline': 'camera',
      'brush-outline': 'paintbrush',
      'game-controller-outline': 'gamecontroller',
      'headset-outline': 'headphones',
      'home-outline': 'house',
      'business-outline': 'building.2',
      'school-outline': 'graduationcap',
      'library-outline': 'books.vertical',
      'medical-outline': 'cross.case',
      'cash-outline': 'dollarsign.circle',
      'gift-outline': 'gift',
      'flash-outline': 'bolt',
      'sunny-outline': 'sun.max',
      'moon-outline': 'moon',
    };
    
    return iconMap[iconName] || 'circle';
  }

  // Setup listeners for habit changes
  setupListeners(): void {
    // Listen for habit changes and update widget data
    const unsubscribe = useHabitStore.subscribe(
      (state) => state.habits,
      () => {
        this.updateWidgetData();
      }
    );

    // Listen for entry changes and update widget data
    const unsubscribeEntries = useHabitStore.subscribe(
      (state) => state.entries,
      () => {
        this.updateWidgetData();
      }
    );

    // Return cleanup function
    return () => {
      unsubscribe();
      unsubscribeEntries();
    };
  }
}

export const widgetService = WidgetService.getInstance();
