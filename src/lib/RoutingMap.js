/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Liberty Global B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import MoviesScreen from '@/screens/MoviesScreen'
import PlayerSelectionScreen from '@/screens/PlayerSelectionScreen'
import AppsScreen from '@/screens/AppsScreen'
import SettingsScreen from '@/screens/SettingsScreen'
import VODScreen from '@/screens/VODScreen'
import DetailsScreen from '@/screens/DetailsScreen'
import AppDetailScreen from '@/screens/AppDetailScreen'
import TVChannelScreen from '@/screens/TVChannelScreen'
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
    url: 'tvchannels',
    menuItem: 0,
    settings: {
      type: TVChannelScreen,
      ref: 'TVChannelScreen',
      ...screenGeometry
    }
  },
  {
    url: 'movies',
    menuItem: -1,
    settings: {
      type: MoviesScreen,
      ref: 'MoviesScreen',
      ...screenGeometry
    }
  },
  {
    url: 'player',
    menuItem: 1,
    settings: {
      type: PlayerSelectionScreen,
      ref: 'PlayerSelectionScreen',
      ...screenGeometry
    }
  },
  {
    url: 'apps',
    menuItem: 2,
    settings: {
      type: AppsScreen,
      ref: 'AppsScreen',
      ...screenGeometry
    }
  },
  {
    url: 'settings',
    menuItem: 3,
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
  },
  {
    url: 'appdetails',
    menuItem: -1,
    settings: {
      type: AppDetailScreen,
      ref: 'AppDetailScreen',
      ...screenGeometry
    }
  }
]
