<template>
  <div class="dashboard-container">
    <h1 class="title">
      <a href="#" target="_blank">{{ VUE_APP_TITLE }}</a>
    </h1>
    <div class="system-intro">
      <p>
        欢迎使用我们的在线考试系统！本系统旨在为用户提供便捷、高效的在线考试体验。无论是学生、教师还是管理员，都能在这里找到所需的功能。</p>
    </div>
    <div class="statistics-container">
      <div class="stat-card">
        <h2>用户参与数量</h2>
        <p class="stat-number">{{ userParticipationCount }}</p>
      </div>
      <div class="stat-card">
        <h2>活跃用户数量</h2>
        <p class="stat-number">{{ activeUserCount }}</p>
      </div>
      <div class="stat-card">
        <h2>考试完成数量</h2>
        <p class="stat-number">{{ completedExamCount }}</p>
      </div>
      <div class="stat-card">
        <h2>试卷批阅数量</h2>
        <p class="stat-number">{{ pendingGradingCount }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      VUE_APP_TITLE: process.env.VUE_APP_TITLE,
      userParticipationCount: this.getRandomNumber(1000, 10000),
      activeUserCount: this.getRandomNumber(500, 5000),
      completedExamCount: this.getRandomNumber(800, 8000),
      pendingGradingCount: this.getRandomNumber(100, 500) // 新增待批改试卷数量
    }
  },
  methods: {
    getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    updateCount(currentCount, min, max) {
      let newCount = this.getRandomNumber(min, max);
      return Math.max(currentCount, newCount); // 确保新数据不小于当前数据
    }
  },
  mounted() {
    setInterval(() => {
      this.userParticipationCount = this.updateCount(this.userParticipationCount, 1000, 10000);
      this.activeUserCount = this.updateCount(this.activeUserCount, 500, 5000);
      this.completedExamCount = this.updateCount(this.completedExamCount, 800, 8000);
      this.pendingGradingCount = this.updateCount(this.pendingGradingCount, 100, 500); // 更新待批改试卷数量
    }, 5000); // 每5秒更新一次数据
  }
}
</script>

<style scoped lang="scss">
div {
  animation: leftMoveIn .7s ease-in;
}

@keyframes leftMoveIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}

.dashboard-container {
  height: calc(100vh - 180px);
  margin: 20px;
  background-color: #fff;
  padding: 20px; // 添加内边距
}

.title {
  a {
    color: #003366; // 更改为深蓝色
    background: linear-gradient(270deg, #409EFF, #79BBFF); // 修改为更鲜艳的蓝色渐变
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientAnimation 5s ease infinite;
  }
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
  animation: bounce 1s infinite;
}

.system-intro {
  text-align: center;
  margin-bottom: 20px;

  p {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
  }
}

.statistics-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px; // 添加卡片之间的间距
}

.stat-card {
  background-color: #f9f9f9; // 更浅的背景色
  border-radius: 12px; // 圆角增加
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); // 更强的阴影
  padding: 30px;
  width: calc(33.333% - 20px); // 调整卡片宽度以适应间距
  margin-bottom: 20px;
  text-align: center; // 确保卡片内容居中
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-10px);
  }

  h2 {
    font-size: 20px;
    margin-bottom: 15px;
    color: #333; // 更深的文字颜色
  }

  .stat-number {
    font-size: 36px;
    font-weight: bold;
    color: #409EFF; // 使用鲜艳的蓝色
    animation: numberAnimation 1s ease-in-out; // 数字滚动动画
  }
}

@media (max-width: 768px) {
  .stat-card {
    width: 100%;
  }
}

a {
  text-decoration: none
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes numberAnimation {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>