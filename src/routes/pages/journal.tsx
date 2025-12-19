import type { Context } from 'hono';
import { Layout } from '../../components/Layout';
import { MOOD_EMOJIS, DEFAULT_TAGS, type MoodLevel } from '../../types';

export const JournalPage = (c: Context) => {
  const moodParam = c.req.query('mood');
  const initialMood = moodParam ? parseInt(moodParam) as MoodLevel : undefined;

  return c.html(
    <Layout title="日記を書く - Mental Health Journal" currentPath="/journal">
      <h2 style={{ marginBottom: 'var(--spacing-md)' }}>📝 今日の日記</h2>

      <form id="journal-form">
        {/* 気分選択 */}
        <div class="card">
          <label class="form-label">今の気分</label>
          <div class="mood-selector" id="mood-selector">
            {([1, 2, 3, 4, 5] as MoodLevel[]).map((level) => (
              <button
                type="button"
                class={`mood-btn ${initialMood === level ? 'selected' : ''}`}
                data-mood={level}
                aria-label={`気分レベル ${level}`}
              >
                {MOOD_EMOJIS[level]}
              </button>
            ))}
          </div>
          <input type="hidden" name="moodLevel" id="mood-input" value={initialMood || ''} />
        </div>

        {/* 日記本文 */}
        <div class="card">
          <div class="form-group">
            <label class="form-label" for="content">今日はどんな一日でしたか？</label>
            <textarea
              class="textarea"
              id="content"
              name="content"
              placeholder="思ったこと、感じたことを自由に書いてください..."
              rows={6}
            ></textarea>
          </div>
        </div>

        {/* タグ選択 */}
        <div class="card">
          <label class="form-label">関連するタグ</label>
          <div id="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
            {DEFAULT_TAGS.map((tag) => (
              <button
                type="button"
                class="tag-btn"
                data-tag={tag}
              >
                {tag}
              </button>
            ))}
          </div>
          <input type="hidden" name="tags" id="tags-input" value="" />
        </div>

        {/* 保存ボタン */}
        <div class="flex flex-col gap-sm">
          <button type="submit" class="btn btn-primary btn-full">
            💾 保存する
          </button>
        </div>
      </form>

      {/* AIアドバイス */}
      <div class="card" style={{ marginTop: 'var(--spacing-md)' }}>
        <h3 class="card-title">💬 AIアドバイス</h3>
        <div class="form-group">
          <label class="form-label">AIを選択</label>
          <div class="ai-provider-selector">
            <button type="button" class="provider-btn selected" data-provider="gemini">
              🔮 Gemini
            </button>
            <button type="button" class="provider-btn" data-provider="openai">
              🤖 GPT-4.1
            </button>
            <button type="button" class="provider-btn" data-provider="claude">
              🧠 Claude
            </button>
          </div>
        </div>
        <button type="button" id="ask-ai-btn" class="btn btn-primary btn-full">
          💬 アドバイスをもらう
        </button>
      </div>

      {/* AIアドバイス表示エリア */}
      <div id="ai-advice-container" class="card" style={{ display: 'none', marginTop: 'var(--spacing-md)' }}>
        <div class="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 class="card-title" style={{ marginBottom: 0 }}>💡 AIからのアドバイス</h3>
          <span id="ai-provider-badge" class="provider-badge">Gemini</span>
        </div>
        <div id="ai-advice-content" style={{ marginTop: 'var(--spacing-md)' }}></div>
      </div>

      <style>{`
        .tag-btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          border: 1px solid var(--border);
          border-radius: var(--radius-full);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tag-btn:hover {
          background: var(--accent);
          border-color: var(--accent);
        }
        .tag-btn.selected {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--bg-primary);
        }
        .ai-provider-selector {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }
        .provider-btn {
          flex: 1;
          padding: var(--spacing-sm);
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .provider-btn:hover {
          border-color: var(--accent);
        }
        .provider-btn.selected {
          border-color: var(--accent);
          background: var(--accent);
          color: var(--bg-primary);
        }
        .provider-badge {
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: var(--accent);
          color: var(--bg-primary);
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>

      <script>{`
        // 気分選択
        let selectedMood = ${initialMood || 'null'};
        document.querySelectorAll('.mood-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedMood = parseInt(this.dataset.mood);
            document.getElementById('mood-input').value = selectedMood;
          });
        });

        // タグ選択
        const selectedTags = new Set();
        document.querySelectorAll('.tag-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const tag = this.dataset.tag;
            if (selectedTags.has(tag)) {
              selectedTags.delete(tag);
              this.classList.remove('selected');
            } else {
              selectedTags.add(tag);
              this.classList.add('selected');
            }
            document.getElementById('tags-input').value = Array.from(selectedTags).join(',');
          });
        });

        // フォーム送信
        document.getElementById('journal-form').addEventListener('submit', async function(e) {
          e.preventDefault();

          if (!selectedMood) {
            alert('気分を選択してください');
            return;
          }

          const content = document.getElementById('content').value;
          const tags = Array.from(selectedTags);

          const entry = {
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            moodLevel: selectedMood,
            content: content,
            tags: tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // IndexedDBに保存（後で実装）
          try {
            const entries = JSON.parse(localStorage.getItem('journal_entries') || '[]');
            entries.unshift(entry);
            localStorage.setItem('journal_entries', JSON.stringify(entries));
            alert('保存しました！');
            window.location.href = '/history';
          } catch (error) {
            alert('保存に失敗しました: ' + error.message);
          }
        });

        // AIプロバイダー選択
        let selectedProvider = 'gemini';
        const providerNames = {
          gemini: '🔮 Gemini',
          openai: '🤖 GPT-4.1',
          claude: '🧠 Claude'
        };

        document.querySelectorAll('.provider-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.provider-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedProvider = this.dataset.provider;
          });
        });

        // AIアドバイス
        document.getElementById('ask-ai-btn').addEventListener('click', async function() {
          const content = document.getElementById('content').value;
          if (!content) {
            alert('日記の内容を入力してください');
            return;
          }

          this.disabled = true;
          this.textContent = '🔄 ' + providerNames[selectedProvider] + ' が考え中...';

          try {
            const response = await fetch('/api/ai/advice', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                journalEntry: content,
                moodLevel: selectedMood || 3,
                recentMoods: [],
                provider: selectedProvider
              })
            });

            const data = await response.json();

            const container = document.getElementById('ai-advice-container');
            const contentDiv = document.getElementById('ai-advice-content');
            const badge = document.getElementById('ai-provider-badge');

            // プロバイダーバッジを更新
            badge.textContent = providerNames[data.provider] || data.provider;

            contentDiv.innerHTML = '<p>' + data.advice + '</p>';
            if (data.suggestions && data.suggestions.length > 0) {
              contentDiv.innerHTML += '<h4 style="margin-top: var(--spacing-md);">おすすめ</h4><ul>' +
                data.suggestions.map(s => '<li>' + s + '</li>').join('') + '</ul>';
            }
            container.style.display = 'block';
          } catch (error) {
            alert('AIアドバイスの取得に失敗しました');
          } finally {
            this.disabled = false;
            this.textContent = '💬 アドバイスをもらう';
          }
        });
      `}</script>
    </Layout>
  );
};
