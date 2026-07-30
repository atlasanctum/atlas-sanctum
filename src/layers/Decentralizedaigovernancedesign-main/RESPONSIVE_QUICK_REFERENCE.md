# 📱 Responsive Design Quick Reference

## Ethos DAO - Developer Cheat Sheet

---

## 🎯 **Breakpoints**

```css
/* Mobile First Approach */
Default:  < 640px   (Mobile)
sm:       640px+    (Large Mobile)
md:       768px+    (Tablet)
lg:       1024px+   (Desktop)
xl:       1280px+   (Large Desktop)
2xl:      1536px+   (XL Desktop)
```

---

## 🔧 **Common Patterns**

### **Responsive Container**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### **Responsive Grid**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {/* Items */}
</div>
```

### **Responsive Stack**
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  {/* Items */}
</div>
```

### **Responsive Text**
```tsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl">Heading</h1>
<p className="text-sm sm:text-base">Paragraph</p>
```

### **Responsive Spacing**
```tsx
<div className="p-4 sm:p-6 lg:p-8">Content</div>
<div className="space-y-4 sm:space-y-6">Items</div>
```

### **Conditional Display**
```tsx
<div className="block lg:hidden">Mobile</div>
<div className="hidden lg:block">Desktop</div>
<div className="hidden md:block lg:hidden">Tablet Only</div>
```

---

## 📦 **Utility Imports**

### **Responsive Utilities**
```tsx
import { 
  isMobile, 
  isTablet, 
  isDesktop,
  responsiveGrid,
  touchTarget,
  responsivePadding 
} from '@/app/lib/responsive';
```

### **Responsive Components**
```tsx
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveCard,
  MobileOnly,
  DesktopOnly,
  ResponsiveSection
} from '@/app/components/ResponsiveContainer';
```

---

## 🎨 **Component Examples**

### **Responsive Container**
```tsx
<ResponsiveContainer size="xl" padding="md">
  <ResponsiveSection
    title="Section Title"
    description="Description text"
    action={<Button>Action</Button>}
  >
    {children}
  </ResponsiveSection>
</ResponsiveContainer>
```

### **Responsive Grid**
```tsx
<ResponsiveGrid 
  cols={{ xs: 1, sm: 2, lg: 3, xl: 4 }} 
  gap="md"
>
  {items.map(item => <Card key={item.id} {...item} />)}
</ResponsiveGrid>
```

### **Responsive Stack**
```tsx
<ResponsiveStack 
  direction="responsive" 
  gap="md" 
  align="center"
  justify="between"
>
  <div>Left Content</div>
  <div>Right Content</div>
</ResponsiveStack>
```

### **Conditional Rendering**
```tsx
<MobileOnly>
  <MobileNavigation />
</MobileOnly>

<DesktopOnly>
  <DesktopNavigation />
</DesktopOnly>
```

---

## 📏 **Touch Targets**

### **Minimum Sizes (iOS Guidelines)**
```tsx
/* Mobile: 44x44px minimum */
<button className="min-h-[44px] min-w-[44px] sm:min-h-[36px]">
  Button
</button>

/* Use touch-target class */
<button className="touch-target">
  Button
</button>
```

---

## 🎯 **Common Responsive Classes**

### **Padding**
```
p-4 sm:p-6 lg:p-8          Progressive padding
px-4 sm:px-6 lg:px-8       Horizontal padding
py-6 sm:py-8 lg:py-12      Vertical padding
```

### **Margin**
```
m-4 sm:m-6 lg:m-8          Progressive margin
mt-6 sm:mt-8 lg:mt-12      Top margin
space-y-4 sm:space-y-6     Vertical spacing between children
```

### **Width**
```
w-full                     Full width
max-w-sm/md/lg/xl/2xl      Maximum widths
w-full sm:w-auto           Full on mobile, auto on desktop
```

### **Display**
```
block lg:hidden            Show on mobile, hide on desktop
hidden lg:block            Hide on mobile, show on desktop
hidden md:block lg:hidden  Tablet only
```

### **Flex**
```
flex flex-col sm:flex-row  Stack mobile, row desktop
flex-wrap                  Allow wrapping
items-center sm:items-start Responsive alignment
gap-4 sm:gap-6             Responsive gap
```

### **Grid**
```
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  Responsive columns
gap-4 sm:gap-6 lg:gap-8                    Responsive gap
```

---

## 🖼️ **Images**

### **Responsive Image**
```tsx
<img 
  src="/image.jpg" 
  alt="Description"
  className="w-full h-auto"
  loading="lazy"
/>
```

### **Next.js Image**
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  className="w-full h-auto"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

---

## 📱 **Mobile-Specific**

### **Prevent iOS Zoom**
```tsx
/* Font size must be >= 16px */
<input className="text-base" />
```

### **Safe Area Insets**
```tsx
<div className="safe-top safe-bottom">
  {/* Content */}
</div>
```

### **Touch Gestures**
```tsx
/* Disable user select on interactive elements */
<div className="select-none touch-none">
  {/* Draggable content */}
</div>
```

---

## 🎨 **Typography Scale**

```
text-xs     0.75rem   (12px)
text-sm     0.875rem  (14px)
text-base   1rem      (16px)
text-lg     1.125rem  (18px)
text-xl     1.25rem   (20px)
text-2xl    1.5rem    (24px)
text-3xl    1.875rem  (30px)
text-4xl    2.25rem   (36px)

/* Responsive variants */
text-sm sm:text-base      14px → 16px
text-base sm:text-lg      16px → 18px
text-xl sm:text-2xl       20px → 24px
text-2xl sm:text-3xl      24px → 30px
```

---

## 📐 **Spacing Scale**

```
0     0px
0.5   0.125rem  (2px)
1     0.25rem   (4px)
2     0.5rem    (8px)
3     0.75rem   (12px)
4     1rem      (16px)
5     1.25rem   (20px)
6     1.5rem    (24px)
8     2rem      (32px)
10    2.5rem    (40px)
12    3rem      (48px)
16    4rem      (64px)
20    5rem      (80px)
24    6rem      (96px)
```

---

## 🔍 **Testing Commands**

### **Start Dev Server**
```bash
npm run dev
```

### **Access from Mobile**
```bash
# Get your local IP
ip addr show | grep inet

# Access from mobile on same network
http://YOUR_IP:3000
```

### **Run Tests**
```bash
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:coverage     # Coverage report
```

---

## ✅ **Checklist**

### **Before Committing**
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1280px)
- [ ] No horizontal scroll
- [ ] Touch targets ≥44px on mobile
- [ ] Text readable without zoom
- [ ] Forms work on mobile

### **Before Deploying**
- [ ] Run Lighthouse mobile audit
- [ ] Test on real iOS device
- [ ] Test on real Android device
- [ ] Check landscape orientation
- [ ] Verify safe area insets
- [ ] Test with 3G network speed

---

## 🚨 **Common Mistakes**

### ❌ **Don't Do**
```tsx
/* Fixed widths */
<div className="w-[1200px]">

/* Desktop-first */
<div className="text-lg md:text-sm">

/* Small touch targets */
<button className="w-8 h-8">

/* Absolute positioning without responsive */
<div className="absolute left-[500px]">
```

### ✅ **Do This Instead**
```tsx
/* Fluid widths */
<div className="w-full max-w-screen-xl">

/* Mobile-first */
<div className="text-sm md:text-lg">

/* Touch-friendly */
<button className="min-h-[44px] min-w-[44px]">

/* Responsive positioning */
<div className="absolute left-4 sm:left-8 lg:left-12">
```

---

## 📚 **Resources**

- **Full Guide:** `/RESPONSIVE_DESIGN_GUIDE.md`
- **Implementation Details:** `/RESPONSIVE_IMPLEMENTATION_COMPLETE.md`
- **Utilities:** `/src/app/lib/responsive.ts`
- **Components:** `/src/app/components/ResponsiveContainer.tsx`
- **CSS:** `/src/styles/responsive.css`

---

## 💡 **Pro Tips**

1. **Always mobile-first** - Start with mobile, enhance for desktop
2. **Use relative units** - rem, em, %, vw instead of px
3. **Test on real devices** - Emulators miss touch behavior
4. **Check landscape** - Don't forget horizontal orientation
5. **Mind the notch** - Use safe-area-insets on iOS
6. **Optimize images** - Lazy load and use responsive sizes
7. **Consider thumb zones** - Bottom of screen easiest to reach
8. **Check orientation** - Test both portrait and landscape
9. **Network matters** - Test on slow 3G connection
10. **Accessibility first** - Responsive includes screen readers

---

**Keep this handy while building responsive components!** 📱💻🖥️
