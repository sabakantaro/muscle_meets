export interface SignUpData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface SignInData {
  email: string
  password: string
}

export interface User {
  map(arg0: (user: any) => JSX.Element): import("react").ReactNode
  includes: number
  id: number
  uid: string | undefined
  provider: string
  email: string
  name: string
  displayName: string
  profile: string
  image: {
    url: string
  }
  imageUrl?: string
  photoURL?: string
  cityId: number | undefined | null
  allowPasswordChange: boolean
  myNotificationsCount: number
  createdAt?: Date
  updatedAt?: Date
  evaluationScore?: number | undefined | null
  followersCount?: number | undefined | null
  followingsCount?: number | undefined | null
  myFavoriteEventIds?: number | undefined | null
  length: number | undefined
}

export interface UpdateUserData {
  id: number | undefined | null
  name?: string
  cityId?: number | undefined | null
  profile?: string
  image?: string
}

export interface UpdateUserFormData extends FormData {
  append(name: keyof UpdateUserData, value: String | Blob, fileName?: string): any
}

export interface Event {
  id?: string | undefined
  userId: number
  categoryId: number | undefined | null
  cityId: number | undefined | null
  title: string
  body: string
  address: string
  meetingDatetime: Date
  image?: string
  imageUrl?: string
  user: any
  category: {
    id: string | undefined
    name: string | undefined
  }
  participate: Participate
  city: City
  eventsFavorites?: EventFavorite
}

export interface UpdateEventData {
  id: number | undefined | null
  name?: string
  cityId?: number | undefined | null
  profile?: string
  image?: string
}

export interface UpdateEventFormData extends FormData {
  append(name: keyof UpdateEventData, value: String | Blob, fileName?: string): any
}

export interface Category {
  map(arg0: (category: any) => JSX.Element): import("react").ReactNode
  id: string | undefined
  name: string | undefined
}

export interface City {
  map(arg0: (city: any) => JSX.Element): import("react").ReactNode
  id: string | undefined
  name: string | undefined
}

export interface Comment {
  map(arg0: (comment: any) => JSX.Element): import("react").ReactNode
  user?: User
  id?: number
  userId?: number
  eventId?: number
  content?: string
}

export interface Participate {
  userId: number
  eventId: number
}

export interface EventFavorite {
  id?: number
  userId: number | undefined | null
  eventId: number | undefined | null
  length?: number
}

export interface Relationship {
  id?: number
  followedId: number | undefined | null
  followerId: number | undefined | null
}

export interface Evaluate {
  id?: number
  evaluatedId?: number
  evaluaterId?: number
  score: number
}

export interface ChatRoom {
  chatRoom: {
    id: number
  }
  otherUser: User,
  lastMessage: Message
}

export interface Message {
  chatRoomId: number
  userId: number | undefined
  content: string
  createdAt?: Date
}

export interface Notification {
  map(arg0: (notification: any) => JSX.Element): import("react").ReactNode
  id?: number
  isChecked: boolean
  linkUrl: string
  imageUrl: string
  content: string
  length: number
}