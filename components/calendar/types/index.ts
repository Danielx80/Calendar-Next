export interface TaskManager {
  id: string;
  dealer_id: string;
  name: string;
  description: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  time_division: number;
  days_to_show: number;
  active_timeline: boolean;
  show_calendar: boolean;
  show_weekly_view: boolean;
  resize_division: number;
  start_time: string;
  end_time: string;
  sections: Section[];
}

export interface Section {
  users: User[];
  id: string;
  name: string;
  description: string;
  status: string;
  order: number;
  color: string;
  icon: string;
}

export interface TdDisabled {
  id: string;
  type: string;
  description: string;
  startDate: Date;
  endDate: Date;
  comment: string;
  user_id: string;
}

export interface TaskDefinition {
  id: string;
  type: string;
  sub_type: string;
  description: string;
  asigned_to: string;
  start_at: Date;
  end_at: Date;
  due_date: Date;
  duration: string;
  planned_at: Date;
  priority: string;
  order_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_productive: boolean;
  text_to_show: string;
  config: Config;
  custom_fields: CustomFields;
}

export interface CustomFields {
  subtasks?: string[];
}

export interface Config {
  allow_attached_files: boolean;
  allow_comments: boolean;
  max_comments: number;
  max_comment_length: number;
  max_files: number;
  allow_recurrence: boolean;
  allow_resizing_up: boolean;
  allow_resizing_down: boolean;
  allow_concurrent_tasks: boolean;
  allow_subtasks: boolean;
  allow_time_tracking: boolean;
}

export interface SubTask {
  id: string;
  description: string;
  type: string;
  sub_type: string;
  status: string;
  priority: string;
  due_date: Date;
  assigned_to: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  parent_task: string;
  config: Config;
}

export interface User {
  UUID: string;
  name: string;
  description: string;
  role: string;
  image: string;
  work_days: WorkDay[];
}

export interface WorkDay {
  day: string;
  start_time: string;
  lunch_time?: string;
  lunch_duration?: number;
  end_time: string;
}

export interface Row {
  sectionId: string;
  sectionName: string;
  sectionDescription: string;
  sectionStatus: string;
  sectionOrder?: number;
  sectionColor?: string;
  sectionIcon?: string;
  userId: string;
  userName: string;
  userRole?: string;
  avatarUrl?: string;
  disabledRanges?: TdDisabled[];
  tasks: TaskDefinition[];
 [key: string]:
    | string
    | number
    | boolean
    | Date
    | TdDisabled[]
    | TaskDefinition[]
    | undefined;
}

export type Timing = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};
