import { useEffect, useRef } from 'react';
import { Type, AlignLeft, Layout, Maximize2, X } from 'lucide-react';
import type { ReadingSettings } from '../types';

interface ReadingSettingsPanelProps {
    settings: ReadingSettings;
    onChange: (settings: ReadingSettings) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function ReadingSettingsPanel({ settings, onChange, isOpen, onClose }: ReadingSettingsPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                // Check if the click was on the settings button itself to prevent double toggle
                const target = event.target as HTMLElement;
                if (!target.closest('.settings-toggle-btn')) {
                    onClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const updateSetting = <K extends keyof ReadingSettings>(key: K, value: ReadingSettings[K]) => {
        onChange({ ...settings, [key]: value });
    };

    return (
        <div className="reading-settings-panel" ref={panelRef} dir="rtl">
            <div className="settings-panel-header">
                <h3>إعدادات القراءة</h3>
                <button className="settings-close-btn" onClick={onClose} aria-label="إغلاق">
                    <X size={16} />
                </button>
            </div>

            <div className="settings-group">
                <label className="settings-label">
                    <Type size={14} />
                    <span>نوع الخط العربي</span>
                </label>
                <div className="settings-options font-family-options">
                    <button
                        className={`settings-opt-btn ${settings.fontFamily === 'tajawal' ? 'active' : ''}`}
                        onClick={() => updateSetting('fontFamily', 'tajawal')}
                        style={{ fontFamily: 'Tajawal, sans-serif' }}
                    >
                        تاجوال (حديث)
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.fontFamily === 'serif' ? 'active' : ''}`}
                        onClick={() => updateSetting('fontFamily', 'serif')}
                        style={{ fontFamily: 'Amiri, serif', fontSize: '1.1rem' }}
                    >
                        أميري (كلاسيكي)
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.fontFamily === 'sans' ? 'active' : ''}`}
                        onClick={() => updateSetting('fontFamily', 'sans')}
                        style={{ fontFamily: 'Noto Sans Arabic, sans-serif' }}
                    >
                        نسخ (افتراضي)
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.fontFamily === 'system' ? 'active' : ''}`}
                        onClick={() => updateSetting('fontFamily', 'system')}
                    >
                        النظام
                    </button>
                </div>
            </div>

            <div className="settings-group">
                <label className="settings-label">
                    <Type size={14} />
                    <span>حجم الخط</span>
                </label>
                <div className="settings-options font-size-options">
                    <button
                        className={`settings-opt-btn ${settings.fontSize === 'sm' ? 'active' : ''}`}
                        onClick={() => updateSetting('fontSize', 'sm')}
                    >
                        صغير
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.fontSize === 'md' ? 'active' : ''}`}
                        onClick={() => updateSetting('fontSize', 'md')}
                    >
                        متوسط
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.fontSize === 'lg' ? 'active' : ''}`}
                        onClick={() => updateSetting('fontSize', 'lg')}
                    >
                        كبير
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.fontSize === 'xl' ? 'active' : ''}`}
                        onClick={() => updateSetting('fontSize', 'xl')}
                    >
                        ضخم
                    </button>
                </div>
            </div>

            <div className="settings-group">
                <label className="settings-label">
                    <AlignLeft size={14} />
                    <span>تباعد الأسطر</span>
                </label>
                <div className="settings-options line-height-options">
                    <button
                        className={`settings-opt-btn ${settings.lineHeight === 'tight' ? 'active' : ''}`}
                        onClick={() => updateSetting('lineHeight', 'tight')}
                    >
                        ضيق
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.lineHeight === 'normal' ? 'active' : ''}`}
                        onClick={() => updateSetting('lineHeight', 'normal')}
                    >
                        عادي
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.lineHeight === 'spacious' ? 'active' : ''}`}
                        onClick={() => updateSetting('lineHeight', 'spacious')}
                    >
                        متسع
                    </button>
                </div>
            </div>

            <div className="settings-group">
                <label className="settings-label">
                    <Maximize2 size={14} />
                    <span>عرض مساحة القراءة</span>
                </label>
                <div className="settings-options page-width-options">
                    <button
                        className={`settings-opt-btn ${settings.pageWidth === 'narrow' ? 'active' : ''}`}
                        onClick={() => updateSetting('pageWidth', 'narrow')}
                    >
                        ضيق (تركيز)
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.pageWidth === 'normal' ? 'active' : ''}`}
                        onClick={() => updateSetting('pageWidth', 'normal')}
                    >
                        متوسط
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.pageWidth === 'wide' ? 'active' : ''}`}
                        onClick={() => updateSetting('pageWidth', 'wide')}
                    >
                        عريض
                    </button>
                </div>
            </div>

            <div className="settings-group">
                <label className="settings-label">
                    <Layout size={14} />
                    <span>نمط الصفحة</span>
                </label>
                <div className="settings-options layout-options">
                    <button
                        className={`settings-opt-btn ${settings.layoutStyle === 'scroll' ? 'active' : ''}`}
                        onClick={() => updateSetting('layoutStyle', 'scroll')}
                    >
                        انسيابي (موقع)
                    </button>
                    <button
                        className={`settings-opt-btn ${settings.layoutStyle === 'book' ? 'active' : ''}`}
                        onClick={() => updateSetting('layoutStyle', 'book')}
                    >
                        نمط الكتاب (ورقي)
                    </button>
                </div>
            </div>
        </div>
    );
}
