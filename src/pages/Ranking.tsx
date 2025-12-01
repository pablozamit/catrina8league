import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const Ranking: React.FC = () => {
  const { t } = useTranslation();

  const rankings = [
    { name: 'Artur', score: 1857 },
    { name: 'Amauris', score: 1778 },
    { name: 'Fer', score: 1623 },
    { name: 'Johnny', score: 1615 },
    { name: 'Pablo', score: 1606 },
    { name: 'Joe', score: 1532 },
    { name: 'Jack', score: 1512 },
    { name: 'Connor', score: 1510 },
    { name: 'Sergio', score: 1500 },
    { name: 'Luke', score: 1467 },
    { name: 'Álvaro', score: 1370 },
    { name: 'David', score: 1339 },
    { name: 'Alex F.', score: 1331 },
    { name: 'Ángel S.', score: 1323 },
    { name: 'Jonathan', score: 1322 },
    { name: 'Katee', score: 1319 },
    { name: 'Angel', score: 1301 },
    { name: 'Adri', score: 1275 },
    { name: 'Sasa', score: 1247 },
    { name: 'Joel', score: 1232 },
    { name: 'Evodia', score: 1232 },
    { name: 'Charles', score: 1200 },
    { name: 'Juanma', score: 1188 },
    { name: 'Nino', score: 1179 },
    { name: 'Nica', score: 1157 },
    { name: 'Roman', score: 1131 },
    { name: 'Vicent', score: 1102 },
    { name: 'Ruairi', score: 1048 },
    { name: 'Mina', score: 1047 },
    { name: 'Maxim', score: 1020 },
    { name: 'Favio', score: 972 },
    { name: 'Raul', score: 938 },
    { name: 'Lucas', score: 935 },
    { name: 'Luis', score: 925 },
    { name: 'Damian', score: 903 },
    { name: 'Alexandre', score: 900 },
    { name: 'Sol', score: 869 },
    { name: 'Danilo', score: 866 },
    { name: 'Ruth', score: 802 },
    { name: 'Lydia', score: 728 },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-gray-900/20 to-purple-900/20" />
        <div className="absolute inset-0">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_70%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold animate-glow-orange mb-6"
          >
            {t('ranking.title')}
          </motion.h1>
          <LanguageSelector />
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="ranking-content text-gray-200">
            {/* Introducción */}
            <p className="mb-6 text-base leading-relaxed">{t('ranking.p1')}</p>
            
            {/* Sección 1 */}
            <h2 className="text-2xl font-bold text-orange-400 mt-10 mb-4">{t('ranking.h2_1')}</h2>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p2')}</p>
            
            {/* Sección 2 */}
            <h2 className="text-2xl font-bold text-orange-400 mt-10 mb-4">{t('ranking.h2_2')}</h2>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p3')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li1')}</li>
              <li>{t('ranking.li2')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p4')}</p>
            
            {/* Sección 3 */}
            <h2 className="text-2xl font-bold text-orange-400 mt-10 mb-4">{t('ranking.h2_3')}</h2>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p5')}</p>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p6')}</p>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p7')}</p>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p8')}</p>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p9')}</p>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p10')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li3')}</li>
              <li>{t('ranking.li4')}</li>
            </ul>
            
            {/* Sección 4 */}
            <h2 className="text-2xl font-bold text-orange-400 mt-10 mb-4">{t('ranking.h2_4')}</h2>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p11')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li5')}</li>
              <li>{t('ranking.li6')}</li>
              <li>{t('ranking.li7')}</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-orange-300 mt-8 mb-3">{t('ranking.h3_1')}</h3>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p12')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li8')}</li>
              <li>{t('ranking.li9')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p13')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li10')}</li>
              <li>{t('ranking.li11')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p14')}</p>
            
            <h3 className="text-xl font-semibold text-orange-300 mt-8 mb-3">{t('ranking.h3_2')}</h3>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p15')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li12')}</li>
              <li>{t('ranking.li13')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p16')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li14')}</li>
              <li>{t('ranking.li15')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p17')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li16')}</li>
              <li>{t('ranking.li17')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p18')}</p>
            
            {/* Sección 5 */}
            <h2 className="text-2xl font-bold text-orange-400 mt-10 mb-4">{t('ranking.h2_5')}</h2>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p19')}</p>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p20')}</p>
            <ol className="list-decimal list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.ol1_li1')}</li>
              <li>{t('ranking.ol1_li2')}</li>
              <li>{t('ranking.ol1_li3')}</li>
              <li>{t('ranking.ol1_li4')}</li>
            </ol>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p21')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li18')}</li>
              <li>{t('ranking.li19')}</li>
              <li>{t('ranking.li20')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p22')}</p>
            
            {/* Sección 6 */}
            <h2 className="text-2xl font-bold text-orange-400 mt-10 mb-4">{t('ranking.h2_6')}</h2>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p23')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li21')}</li>
              <li>{t('ranking.li22')}</li>
              <li>{t('ranking.li23')}</li>
              <li>{t('ranking.li24')}</li>
              <li>{t('ranking.li25')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p24')}</p>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p25')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li26')}</li>
              <li>{t('ranking.li27')}</li>
            </ul>
            
            {/* Sección 7 */}
            <h2 className="text-2xl font-bold text-orange-400 mt-10 mb-4">{t('ranking.h2_7')}</h2>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p26')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li28')}</li>
              <li>{t('ranking.li29')}</li>
              <li>{t('ranking.li30')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p27')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li31')}</li>
              <li>{t('ranking.li32')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p28')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li33')}</li>
              <li>{t('ranking.li34')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p29')}</p>
            
            {/* Sección 8 */}
            <h2 className="text-2xl font-bold text-orange-400 mt-10 mb-4">{t('ranking.h2_8')}</h2>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p30')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li35')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p31')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li36')}</li>
              <li>{t('ranking.li37')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p32')}</p>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p33')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li38')}</li>
              <li>{t('ranking.li39')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p34')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li40')}</li>
              <li>{t('ranking.li41')}</li>
            </ul>
            
            {/* Sección 9 */}
            <h2 className="text-2xl font-bold text-orange-400 mt-10 mb-4">{t('ranking.h2_9')}</h2>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p35')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li42')}</li>
              <li>{t('ranking.li43')}</li>
            </ul>
            <p className="mb-4 text-base leading-relaxed">{t('ranking.p36')}</p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-2 text-gray-300">
              <li>{t('ranking.li44')}</li>
              <li>{t('ranking.li45')}</li>
            </ul>
            <p className="mb-6 text-base leading-relaxed">{t('ranking.p37')}</p>
            
            {/* Ranking Table - Unified Style */}
            <div className="mt-12 mb-8">
              <h3 className="text-2xl font-bold text-center text-orange-400 mb-6">
                {t('ranking.p38')}
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {rankings.map((player, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      <span className="font-medium text-gray-200">{player.name}</span>
                      <span className="font-bold text-orange-400 text-lg">{player.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ranking;
