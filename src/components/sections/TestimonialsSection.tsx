import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Thị Mai",
    role: "Học viên HSK 3",
    content:
      "Cô dạy rất dễ hiểu và tận tâm! Mình từ zero tiếng Trung, sau 3 tháng đã có thể giao tiếp cơ bản được rồi. Cảm ơn cô nhiều lắm! 💕",
    rating: 5,
    platform: "Facebook",
  },
  {
    name: "Trần Văn Hùng",
    role: "Học viên HSK 4",
    content:
      "Phương pháp dạy rất thực tế, không chỉ học ngữ pháp mà còn được học cả văn hóa Trung Quốc. Thi HSK 4 đỗ ngay lần đầu!",
    rating: 5,
    platform: "TikTok",
  },
  {
    name: "Lê Thị Hương",
    role: "Học viên giao tiếp",
    content:
      "Lớp học rất vui và sôi động. Cô MeoHi tạo môi trường học thoải mái, mình không còn sợ nói tiếng Trung nữa!",
    rating: 5,
    platform: "Facebook",
  },
  {
    name: "Phạm Đức Anh",
    role: "Học viên HSK 5",
    content:
      "Đã học nhiều nơi nhưng ở đây thấy hiệu quả nhất. Cô hỗ trợ rất nhiệt tình, reply tin nhắn nhanh lắm!",
    rating: 5,
    platform: "TikTok",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-24 bg-card" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Nhận xét
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Học viên nói gì về <span className="text-gradient">MeoHi</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hàng trăm học viên đã tin tưởng và đồng hành cùng tôi trên hành
            trình chinh phục tiếng Trung
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {testimonial.platform}
                </span>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold" />
                ))}
              </div>

              <div className="relative">
                <Quote
                  size={24}
                  className="absolute -top-2 -left-2 text-primary/20"
                />
                <p className="text-muted-foreground pl-4 leading-relaxed">
                  {testimonial.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-2">
            Bạn cũng muốn chia sẻ trải nghiệm học tập?
          </p>
          <a
            href="#contact"
            className="text-primary font-medium hover:underline"
          >
            Để lại nhận xét của bạn →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
