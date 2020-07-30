import MoviesScreen from '@/screens/MoviesScreen'
import AppsScreen from '@/screens/AppsScreen'
import SettingsScreen from '@/screens/SettingsScreen'
import VODScreen from '@/screens/VODScreen'
import DetailsScreen from '@/screens/DetailsScreen'
import HomeScreen from '@/screens/HomeScreen'
import commonConstants from '@/constants/default'

const screenGeometry = {
  x: 0,
  y: 0,
  w: commonConstants.screen.width,
  h: commonConstants.screen.height
}

export const routings = [
  {
    url: 'home',
    menuItem: -1,
    settings: {
      type: HomeScreen,
      ref: 'HomeScreen',
      ...screenGeometry
    }
  },
  {
    url: 'movies',
    menuItem: 0,
    settings: {
      type: MoviesScreen,
      ref: 'MoviesScreen',
      ...screenGeometry
    }
  },
  {
    url: 'apps',
    menuItem: 1,
    settings: {
      type: AppsScreen,
      ref: 'AppsScreen',
      ...screenGeometry
    }
  },
  {
    url: 'settings',
    menuItem: 2,
    settings: {
      type: SettingsScreen,
      ref: 'SettingsScreen',
      ...screenGeometry
    }
  },
  {
    url: 'details',
    menuItem: -1,
    settings: {
      type: DetailsScreen,
      ref: 'DetailsScreen',
      ...screenGeometry
    }
  },
  {
    url: 'vod',
    menuItem: -1,
    settings: {
      type: VODScreen,
      ref: 'VODScreen',
      ...screenGeometry
    }
  }
]
