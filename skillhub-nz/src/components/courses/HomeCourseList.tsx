import { ServerCourseCard } from './ServerCourseCard';

// 课程数据类型（支持演示数据和Firebase数据）
interface CourseData {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  maxStudents: number;
  currentStudents: number;
  level: string;
  rating: number;
  totalReviews: number;
  images?: string[];
  coach: {
    id: string;
    name: string;
    location: string;
    avatar?: string;
  } | null;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  } | null;
  createdAt: any;
}

interface HomeCourseListProps {
  courses: CourseData[];
}

export function HomeCourseList({ courses }: HomeCourseListProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">暂无课程</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <ServerCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
