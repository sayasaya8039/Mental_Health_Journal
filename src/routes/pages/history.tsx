import type { Context } from 'hono';
import { raw } from 'hono/html';
import { Layout } from '../../components/Layout';
import { MOOD_EMOJIS, MOOD_COLORS, type MoodLevel } from '../../types';

export const HistoryPage = (c: Context) => {
  return c.html(
    <Layout title="履歴 - Mental Health Journal" currentPath="/history">
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>📊 気分の履歴</h2>

      {/* 期間選択 */}
      <div class="card">
        <div class="flex gap-sm" style={{ justifyContent: 'center' }}>
          <button class="period-btn active" data-period="week">1週間</button>
          <button class="period-btn" data-period="month">1ヶ月</button>
          <button class="period-btn" data-period="all">全期間</button>
        </div>
      </div>

      {/* 統計サマリー */}
      <div class="card">
        <h3 class="card-title">📈 統計</h3>
        <div id="stats-summary" class="flex" style={{ justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem' }} id="avg-mood">--</div>
            <div class="text-secondary">平均気分</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem' }} id="entry-count">0</div>
            <div class="text-secondary">記録数</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem' }} id="streak">0</div>
            <div class="text-secondary">連続日数</div>
          </div>
        </div>
      </div>

      {/* 気分グラフ */}
      <div class="card">
        <h3 class="card-title">気分の推移</h3>
        <div id="mood-chart" style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: 'var(--spacing-md)' }}>
          {/* JavaScriptで動的に生成 */}
        </div>
        <div id="chart-labels" class="flex" style={{ justifyContent: 'space-around', marginTop: 'var(--spacing-sm)', fontSize: '0.75rem' }}>
          {/* 日付ラベル */}
        </div>
      </div>

      {/* エントリー一覧 */}
      <div class="card">
        <h3 class="card-title">記録一覧</h3>
        <div id="entries-list">
          <p class="text-secondary text-center" style={{ padding: 'var(--spacing-lg)' }}>
            データを読み込み中...
          </p>
        </div>
      </div>

      {/* データ管理 */}
      <div class="card">
        <h3 class="card-title">データ管理</h3>
        <div class="flex flex-col gap-sm">
          <button id="export-btn" class="btn btn-secondary btn-full">
            📤 データをエクスポート
          </button>
          <button id="delete-all-btn" class="btn btn-secondary btn-full" style={{ color: 'var(--error)' }}>
            🗑️ 全データを削除
          </button>
        </div>
      </div>

      <style>{`
        .period-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          background: var(--bg-secondary);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
        }
        .period-btn:hover, .period-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--bg-primary);
        }
        .entry-item {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border);
        }
        .entry-item:last-child {
          border-bottom: none;
        }
        .entry-mood {
          font-size: 1.5rem;
        }
        .entry-content {
          flex: 1;
        }
        .entry-date {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .entry-text {
          margin-top: var(--spacing-xs);
          font-size: 0.875rem;
        }
        .entry-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-top: var(--spacing-xs);
        }
        .entry-tag {
          font-size: 0.75rem;
          padding: 2px 6px;
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
        }
        .chart-bar {
          width: 30px;
          background: var(--accent);
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          transition: height 0.3s;
          display: flex;
          justify-content: center;
          padding-top: var(--spacing-xs);
          font-size: 0.875rem;
        }
      `}</style>

      {raw(`<script>
        const MOOD_EMOJIS = ${JSON.stringify(MOOD_EMOJIS)};
        const MOOD_COLORS = ${JSON.stringify(MOOD_COLORS)};

        let currentPeriod = 'week';

        // 期間選択
        document.querySelectorAll('.period-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentPeriod = this.dataset.period;
            loadData();
          });
        });

        // データ読み込み
        function loadData() {
          const entries = JSON.parse(localStorage.getItem('journal_entries') || '[]');

          // 期間フィルター
          const now = new Date();
          const filtered = entries.filter(entry => {
            const entryDate = new Date(entry.date);
            if (currentPeriod === 'week') {
              return (now - entryDate) / (1000 * 60 * 60 * 24) <= 7;
            } else if (currentPeriod === 'month') {
              return (now - entryDate) / (1000 * 60 * 60 * 24) <= 30;
            }
            return true;
          });

          updateStats(filtered);
          updateChart(filtered);
          updateEntryList(filtered);
        }

        // 統計更新
        function updateStats(entries) {
          const avgMood = entries.length > 0
            ? (entries.reduce((sum, e) => sum + e.moodLevel, 0) / entries.length).toFixed(1)
            : '--';

          document.getElementById('avg-mood').textContent =
            entries.length > 0 ? MOOD_EMOJIS[Math.round(parseFloat(avgMood))] : '--';
          document.getElementById('entry-count').textContent = entries.length;

          // 連続日数計算
          let streak = 0;
          const today = new Date().toISOString().split('T')[0];
          const dates = [...new Set(entries.map(e => e.date))].sort().reverse();
          for (let i = 0; i < dates.length; i++) {
            const expected = new Date(today);
            expected.setDate(expected.getDate() - i);
            if (dates[i] === expected.toISOString().split('T')[0]) {
              streak++;
            } else {
              break;
            }
          }
          document.getElementById('streak').textContent = streak;
        }

        // グラフ更新
        function updateChart(entries) {
          const chartContainer = document.getElementById('mood-chart');
          const labelsContainer = document.getElementById('chart-labels');

          // 最新7日分のデータ
          const days = 7;
          const dailyData = [];
          for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayEntries = entries.filter(e => e.date === dateStr);
            const avgMood = dayEntries.length > 0
              ? dayEntries.reduce((sum, e) => sum + e.moodLevel, 0) / dayEntries.length
              : 0;
            dailyData.push({
              date: dateStr,
              label: (date.getMonth() + 1) + '/' + date.getDate(),
              mood: avgMood
            });
          }

          chartContainer.innerHTML = dailyData.map(d =>
            '<div class="chart-bar" style="height: ' + (d.mood ? d.mood * 30 + 20 : 10) + 'px; background: ' + (d.mood ? MOOD_COLORS[Math.round(d.mood)] : 'var(--border)') + '">' +
            (d.mood ? MOOD_EMOJIS[Math.round(d.mood)] : '') + '</div>'
          ).join('');

          labelsContainer.innerHTML = dailyData.map(d =>
            '<span>' + d.label + '</span>'
          ).join('');
        }

        // エントリー一覧更新
        function updateEntryList(entries) {
          const container = document.getElementById('entries-list');

          if (entries.length === 0) {
            container.innerHTML = '<p class="text-secondary text-center" style="padding: var(--spacing-lg)">この期間の記録はありません</p>';
            return;
          }

          container.innerHTML = entries.slice(0, 20).map(entry => {
            const date = new Date(entry.date);
            const dateStr = date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' });
            return '<div class="entry-item">' +
              '<span class="entry-mood">' + MOOD_EMOJIS[entry.moodLevel] + '</span>' +
              '<div class="entry-content">' +
                '<div class="entry-date">' + dateStr + '</div>' +
                '<div class="entry-text">' + (entry.content || '(内容なし)').substring(0, 100) + '</div>' +
                (entry.tags && entry.tags.length > 0 ?
                  '<div class="entry-tags">' + entry.tags.map(t => '<span class="entry-tag">' + t + '</span>').join('') + '</div>' : ''
                ) +
              '</div>' +
            '</div>';
          }).join('');
        }

        // エクスポート
        document.getElementById('export-btn').addEventListener('click', function() {
          const entries = localStorage.getItem('journal_entries') || '[]';
          const blob = new Blob([entries], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'mental_health_journal_' + new Date().toISOString().split('T')[0] + '.json';
          a.click();
          URL.revokeObjectURL(url);
        });

        // 全削除
        document.getElementById('delete-all-btn').addEventListener('click', function() {
          if (confirm('本当に全てのデータを削除しますか？この操作は取り消せません。')) {
            localStorage.removeItem('journal_entries');
            loadData();
            alert('全てのデータを削除しました');
          }
        });

        // 初期読み込み
        loadData();
      </script>`)}
    </Layout>
  );
};
