import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Star,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import RegistrationModal from "@/components/RegistrationModal";

const courses = [
  {
    title: "Tiếng Trung Cơ Bản",
    subtitle: "HSK 1-2",
    price: "1.500.000",
    duration: "3 tháng",
    lessons: "24 buổi",
    features: [
      "Phát âm chuẩn Pinyin",
      "500+ từ vựng thông dụng",
      "Giao tiếp cơ bản hàng ngày",
      "Tài liệu học tập PDF",
      "Hỗ trợ qua Zalo/Facebook",
    ],
    popular: false,
  },
  {
    title: "Tiếng Trung Giao Tiếp",
    subtitle: "HSK 3-4",
    price: "2.500.000",
    duration: "4 tháng",
    lessons: "32 buổi",
    features: [
      "1500+ từ vựng nâng cao",
      "Ngữ pháp HSK 3-4",
      "Luyện nghe - nói chuyên sâu",
      "Video bài giảng trọn đời",
      "Nhóm học tập riêng",
      "Chữa bài 1-1",
    ],
    popular: true,
  },
  {
    title: "Luyện thi HSK",
    subtitle: "HSK 4-5",
    price: "3.000.000",
    duration: "5 tháng",
    lessons: "40 buổi",
    features: [
      "Chiến thuật làm bài thi",
      "Đề thi thử mỗi tuần",
      "Luyện viết chuyên sâu",
      "Đọc hiểu nâng cao",
      "Cam kết đầu ra HSK",
      "Học lại miễn phí nếu thi trượt",
    ],
    popular: false,
  },
];

const classRules = [
  {
    number: 1,
    content:
      "Gia sư xin nghỉ xin phép trước 1 ngày, học viên nghỉ học báo trước 4 tiếng nếu không tính một buổi.",
  },
  {
    number: 2,
    content:
      "Xin nghỉ quá 40% buổi học xin hoàn lại 20% tiền học và ngưng lớp.",
  },
  {
    number: 3,
    content:
      "Học viên trước khi học xem trước bài, sau khi học ôn tập và làm bài tập để bắt đầu buổi học mới.",
  },
];

const CoursesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  return (
    <section id="courses" className="py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Khóa học
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Chọn khóa học <span className="text-gradient">phù hợp</span> với bạn
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Các khóa học được thiết kế theo cấp độ HSK chuẩn quốc tế, phù hợp
            với mọi nhu cầu học tập
          </p>

          {/* Class Rules Collapsible */}
          <Collapsible
            open={isRulesOpen}
            onOpenChange={setIsRulesOpen}
            className="max-w-2xl mx-auto"
          >
            <CollapsibleTrigger asChild>
              <Button variant="heroOutline" className="w-full md:w-auto gap-2">
                <AlertCircle size={18} />
                Quy định lớp học
                {isRulesOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-2xl p-6 text-left shadow-medium"
              >
                <h4 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="text-primary" size={20} />
                  Yêu cầu lớp học và gia sư
                </h4>
                <ul className="space-y-4">
                  {classRules.map((rule) => (
                    <li key={rule.number} className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                        {rule.number}
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {rule.content}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative bg-card rounded-3xl p-8 border ${
                course.popular
                  ? "border-primary shadow-strong"
                  : "border-border hover:border-primary/50"
              } transition-all duration-300 hover:shadow-medium`}
            >
              {course.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 gradient-accent text-primary-foreground text-sm font-medium rounded-full flex items-center gap-1">
                  <Star size={14} fill="currentColor" /> Phổ biến nhất
                </div>
              )}

              <div className="text-center mb-6">
                <span className="text-sm text-primary font-medium">
                  {course.subtitle}
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground mt-2">
                  {course.title}
                </h3>
              </div>

              <div className="text-center mb-6">
                <span className="font-display text-4xl font-bold text-foreground">
                  {course.price}
                </span>
                <span className="text-muted-foreground">đ</span>
              </div>

              <div className="flex justify-center gap-6 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {course.lessons}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {course.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={course.popular ? "hero" : "heroOutline"}
                className="w-full"
                size="lg"
                onClick={() => {
                  setSelectedCourse(
                    course.subtitle
                      .toLowerCase()
                      .replace(" ", "")
                      .replace("-", ""),
                  );
                  setIsModalOpen(true);
                }}
              >
                Đăng ký ngay
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedCourse={selectedCourse}
      />
    </section>
  );
};

export default CoursesSection;
