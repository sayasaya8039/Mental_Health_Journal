import type { Context } from 'hono';
import { Layout } from '../../components/Layout';
import { MOOD_EMOJIS, type MoodLevel } from '../../types';

export const HomePage = (c: Context) => {
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return c.html(
    <Layout title="Mental Health Journal - ホーム" currentPath="/">
      {/* 今日の日付 */}
      <div class="card text-center">
        <p class="text-secondary">{today}</p>
        <h2 style={{ fontSize: '1.5rem', marginTop: 'var(--spacing-sm)' }}>
          今日の気分はいかがですか？
        </h2>
      </div>

      {/* 気分選択 */}
      <div class="card">
        <div class="mood-selector" id="mood-selector">
          {([1, 2, 3, 4, 5] as MoodLevel[]).map((level) => (
            <button
              class="mood-btn"
              data-mood={level}
              aria-label={`気分レベル ${level}`}
            >
              {MOOD_EMOJIS[level]}
            </button>
          ))}
        </div>
        <p class="text-center text-secondary" style={{ fontSize: '0.875rem' }}>
          タップして今の気分を選んでください
        </p>
      </div>

      {/* クイックアクション */}
      <div class="card">
        <h3 class="card-title">クイックアクション</h3>
        <div class="flex flex-col gap-sm">
          <a href="/journal" class="btn btn-primary btn-full">
            📝 日記を書く
          </a>
          <a href="/history" class="btn btn-secondary btn-full">
            📊 気分の推移を見る
          </a>
        </div>
      </div>

      {/* AIからの一言 */}
      <div class="card" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', color: 'var(--bg-primary)' }}>
        <h3 class="card-title" style={{ color: 'inherit' }}>💬 今日のメッセージ</h3>
        <p id="ai-message">
          自分の気持ちに正直になることは、心のケアの第一歩です。
          今日も一日、自分を大切にしてくださいね。
        </p>
      </div>

      {/* 最近のエントリー */}
      <div class="card">
        <h3 class="card-title">最近の記録</h3>
        <div id="recent-entries">
          <p class="text-secondary text-center" style={{ padding: 'var(--spacing-lg)' }}>
            まだ記録がありません。<br />
            今日から気分を記録してみましょう！
          </p>
        </div>
      </div>

      {/* 気分選択のスクリプト */}
      <script>{`
        document.querySelectorAll('.mood-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            const mood = this.dataset.mood;
            // 選択後、日記ページへ遷移
            setTimeout(() => {
              window.location.href = '/journal?mood=' + mood;
            }, 300);
          });
        });
      `}</script>
    </Layout>
  );
};
