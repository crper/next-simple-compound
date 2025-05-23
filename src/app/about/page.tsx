'use client';

import { getRuntimeBasePath } from '@/utils/path';
import {
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  BulbOutlined,
  CalculatorOutlined,
  CodeOutlined,
  CrownOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  FieldTimeOutlined,
  FundOutlined,
  GithubOutlined,
  LockOutlined,
  MobileOutlined,
  PercentageOutlined,
  SafetyOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import {
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  List,
  Row,
  Space,
  Tag,
  Timeline,
  Typography,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
  // 获取运行时 basePath
  const basePath = getRuntimeBasePath();

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-y-2">
      {/* 介绍部分 */}
      <Card className="shadow-lg glass" variant="outlined" title="关于 Compound+ 复利计算器">
        <Paragraph className="text-lg mb-4">
          Compound+
          是一款现代化的复利计算工具，旨在帮助用户轻松规划财务未来。无论您是投资新手还是理财专家，
          我们的工具都能帮助您直观地了解复利的强大力量，为长期财务目标制定明智的计划。
        </Paragraph>

        <Paragraph className="text-lg mb-6">
          复利被爱因斯坦称为世界第八大奇迹，它是财富增长的关键因素之一。通过我们的计算器，
          您可以模拟不同的投资场景，了解时间、利率和定期投资如何共同影响您的财富增长。
        </Paragraph>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <AppstoreOutlined className="text-blue-500" />
                  <Text strong>核心功能</Text>
                </Space>
              }
              className="h-full hover-lift"
            >
              <List
                dataSource={[
                  { icon: <CalculatorOutlined />, text: '多种计算模式（终值、本金、期数、利率）' },
                  { icon: <BarChartOutlined />, text: '直观的数据可视化图表' },
                  { icon: <DatabaseOutlined />, text: '详细的数据表格展示' },
                  { icon: <BulbOutlined />, text: '深色/浅色主题切换' },
                  { icon: <ThunderboltOutlined />, text: '实时计算结果' },
                  { icon: <PercentageOutlined />, text: '通货膨胀影响计算' },
                ]}
                renderItem={item => (
                  <List.Item>
                    <Space align="center">
                      <span className="text-blue-500">{item.icon}</span>
                      <Text>{item.text}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <CodeOutlined className="text-blue-500" />
                  <Text strong>技术特点</Text>
                </Space>
              }
              className="h-full hover-lift"
            >
              <List
                dataSource={[
                  { icon: <CodeOutlined />, text: '使用 Next.js 和 React 构建的现代 Web 应用' },
                  { icon: <AppstoreOutlined />, text: 'Ant Design 组件库提供优雅的用户界面' },
                  { icon: <BarChartOutlined />, text: 'Recharts 提供高性能图表渲染' },
                  { icon: <MobileOutlined />, text: '响应式设计，适配各种设备' },
                  { icon: <SafetyOutlined />, text: '无服务器架构，保护用户隐私' },
                  { icon: <GithubOutlined />, text: '完全开源，代码透明' },
                ]}
                renderItem={item => (
                  <List.Item>
                    <Space align="center">
                      <span className="text-blue-500">{item.icon}</span>
                      <Text>{item.text}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 使用指南部分 */}
      <Card className="shadow-lg glass" variant="outlined" title="使用指南">
        <Timeline
          items={[
            {
              dot: <BookOutlined className="text-blue-500 text-xl" />,
              color: 'blue',
              children: (
                <Card title="1. 选择计算模式" className="mt-2 mb-4 hover-lift">
                  <Paragraph>根据您的需求选择适合的计算模式：</Paragraph>
                  <Descriptions
                    bordered
                    column={{ xs: 1, sm: 1, md: 2 }}
                    size="small"
                    className="mt-2"
                  >
                    <Descriptions.Item label={<Text strong>终值计算</Text>}>
                      已知本金、利率和期数，计算最终金额
                    </Descriptions.Item>
                    <Descriptions.Item label={<Text strong>本金计算</Text>}>
                      已知目标金额、利率和期数，计算所需本金
                    </Descriptions.Item>
                    <Descriptions.Item label={<Text strong>期数计算</Text>}>
                      已知本金、目标金额和利率，计算所需时间
                    </Descriptions.Item>
                    <Descriptions.Item label={<Text strong>利率计算</Text>}>
                      已知本金、目标金额和期数，计算所需年利率
                    </Descriptions.Item>
                    <Descriptions.Item label={<Text strong>通货膨胀影响</Text>}>
                      计算通货膨胀对投资终值实际购买力的影响
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ),
            },
            {
              dot: <SettingOutlined className="text-blue-500 text-xl" />,
              color: 'blue',
              children: (
                <Card title="2. 输入参数" className="mt-2 mb-4 hover-lift">
                  <Paragraph>
                    根据选择的模式，输入相应的参数，如本金、年利率、期数和定期追加投资金额。
                    系统会根据您的输入进行精确计算。所有计算都会实时进行，无需点击额外按钮。
                  </Paragraph>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Tag color="blue">本金</Tag>
                    <Tag color="green">年利率</Tag>
                    <Tag color="orange">投资期数</Tag>
                    <Tag color="purple">追加投资</Tag>
                    <Tag color="cyan">复利频率</Tag>
                  </div>
                </Card>
              ),
            },
            {
              dot: <BarChartOutlined className="text-blue-500 text-xl" />,
              color: 'blue',
              children: (
                <Card title="3. 查看结果与图表" className="mt-2 mb-4 hover-lift">
                  <Paragraph>
                    计算完成后，您可以查看详细的结果数据和直观的图表展示。图表显示了本金、利息和总额随时间的变化趋势。
                    您还可以查看详细的数据表格，了解每个时间点的具体数值。
                  </Paragraph>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Tag color="geekblue">增长曲线</Tag>
                    <Tag color="lime">柱状图</Tag>
                    <Tag color="volcano">构成比例</Tag>
                    <Tag color="magenta">数据表格</Tag>
                  </div>
                </Card>
              ),
            },
            {
              dot: <BulbOutlined className="text-blue-500 text-xl" />,
              color: 'blue',
              children: (
                <Card title="4. 切换主题" className="mt-2 mb-4 hover-lift">
                  <Paragraph>
                    根据个人偏好，您可以在浅色和深色主题之间切换，提供更舒适的使用体验。
                    系统会记住您的偏好设置，下次访问时自动应用。
                  </Paragraph>
                </Card>
              ),
            },
            {
              dot: <ThunderboltOutlined className="text-blue-500 text-xl" />,
              color: 'blue',
              children: (
                <Card title="5. 通货膨胀影响计算" className="mt-2 mb-4 hover-lift">
                  <Paragraph>
                    选择通货膨胀计算模式，输入本金、年利率、通货膨胀率和投资期数，
                    系统将计算并展示通货膨胀对您投资的实际影响。
                  </Paragraph>
                  <Paragraph>
                    结果将显示名义终值（不考虑通货膨胀）和实际购买力（考虑通货膨胀后），
                    以及通货膨胀造成的购买力损失百分比和实际收益率。
                  </Paragraph>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Tag color="gold">名义终值</Tag>
                    <Tag color="green">实际购买力</Tag>
                    <Tag color="red">购买力损失</Tag>
                    <Tag color="blue">实际收益率</Tag>
                  </div>
                </Card>
              ),
            },
          ]}
        />
      </Card>

      {/* 复利的力量部分 */}
      <Card className="shadow-lg glass" variant="outlined" title="复利的力量">
        <Card className="hover-lift">
          <Paragraph className="mb-4">
            复利被爱因斯坦称为世界第八大奇迹，它是指将投资所产生的收益再投资，从而使资金以指数方式增长的过程。
          </Paragraph>
          <Paragraph className="mb-4">
            复利的力量在于时间。即使是小额但长期的投资，通过复利的作用，最终也能累积成可观的财富。
            这就是为什么财务专家常说：投资的最佳时机是20年前，其次是现在。
          </Paragraph>

          <Divider orientation="left">关键特点</Divider>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <Space>
                    <FieldTimeOutlined className="text-blue-500" />
                    <Text strong>时间是关键</Text>
                  </Space>
                }
              >
                投资时间越长，复利效应越显著
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <Space>
                    <CrownOutlined className="text-blue-500" />
                    <Text strong>早期投资价值高</Text>
                  </Space>
                }
              >
                早期投入的资金会产生更多的复合增长
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <Space>
                    <FundOutlined className="text-blue-500" />
                    <Text strong>定期投资的力量</Text>
                  </Space>
                }
              >
                定期追加投资可以显著提高最终收益
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={
                  <Space>
                    <PercentageOutlined className="text-blue-500" />
                    <Text strong>利率影响巨大</Text>
                  </Space>
                }
              >
                即使是小幅度的年利率提升，长期来看也会产生巨大差异
              </Card>
            </Col>
          </Row>

          <Divider orientation="left">通货膨胀与实际收益</Divider>

          <Card size="small" className="mt-4">
            <Paragraph>
              通货膨胀是投资中不可忽视的重要因素，它会侵蚀您投资的实际购买力。即使您的投资有正回报，
              如果回报率低于通货膨胀率，您的实际购买力实际上是在下降的。
            </Paragraph>
            <Paragraph>我们的计算器提供了通货膨胀影响计算模式，帮助您了解：</Paragraph>
            <ul className="list-disc pl-5 mb-4">
              <li>名义终值与实际购买力的差异</li>
              <li>通货膨胀造成的购买力损失百分比</li>
              <li>扣除通货膨胀后的实际收益率</li>
            </ul>
            <Paragraph>
              长期投资规划应始终考虑通货膨胀因素，选择能够跑赢通胀的投资方式，
              才能确保财富的真正增长。
            </Paragraph>
          </Card>
        </Card>
      </Card>

      {/* 开源与贡献部分 */}
      <Card className="shadow-lg glass" variant="outlined" title="开源与贡献">
        <Paragraph className="mb-4">
          Compound+
          复利计算器是一个开源项目，我们欢迎社区贡献。如果您有任何建议、功能请求或发现了问题，
          请访问我们的 GitHub 仓库提交 issue 或 pull request。
        </Paragraph>

        <Paragraph className="mb-4">我们特别欢迎以下类型的贡献：</Paragraph>

        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={8}>
            <Card size="small" className="text-center">
              <CodeOutlined className="text-blue-500 text-2xl mb-2" />
              <div>新功能开发和改进</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" className="text-center">
              <DesktopOutlined className="text-blue-500 text-2xl mb-2" />
              <div>用户界面优化</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" className="text-center">
              <BookOutlined className="text-blue-500 text-2xl mb-2" />
              <div>文档完善</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" className="text-center">
              <TranslationOutlined className="text-blue-500 text-2xl mb-2" />
              <div>多语言支持</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" className="text-center">
              <ThunderboltOutlined className="text-blue-500 text-2xl mb-2" />
              <div>性能优化</div>
            </Card>
          </Col>
        </Row>

        <div className="flex justify-center mt-4">
          <a
            href="https://github.com/crper/next-simple-compound"
            target="_blank"
            rel="noopener noreferrer"
            className="ant-btn ant-btn-primary ant-btn-lg flex items-center gap-2 glass"
          >
            <GithubOutlined />
            访问 GitHub 仓库
          </a>
        </div>
      </Card>

      {/* 隐私声明部分 */}
      <Card className="shadow-lg glass" variant="outlined" title="隐私声明">
        <Card className="hover-lift">
          <Space direction="vertical" size="middle">
            <Space align="start">
              <SafetyOutlined className="text-green-500 text-xl" />
              <Paragraph className="m-0">
                Compound+
                复利计算器高度重视您的隐私。我们的应用完全在您的浏览器中运行，所有计算都在本地进行。
              </Paragraph>
            </Space>
            <Space align="start">
              <LockOutlined className="text-green-500 text-xl" />
              <Paragraph className="m-0">
                我们不收集、存储或传输任何用户数据。您的财务信息完全保留在您的设备上，确保您的隐私安全。
              </Paragraph>
            </Space>
          </Space>
        </Card>
      </Card>

      {/* 支持作者部分 */}
      <Card
        className="shadow-lg glass"
        variant="outlined"
        title={
          <Title level={2} className="gradient-text m-0">
            支持作者
          </Title>
        }
      >
        <Card className="hover-lift">
          <Paragraph className="text-center text-lg mb-6">
            如果您觉得这个工具对您有所帮助，可以考虑支持作者继续改进和维护这个项目。您的支持是我们前进的动力！
          </Paragraph>

          <Row gutter={24} justify="center" align="middle">
            <Col xs={24} md={12} className="text-center">
              <Card
                title={
                  <Text strong className="text-blue-500">
                    微信支付
                  </Text>
                }
                variant="outlined"
                className="flex flex-col items-center"
              >
                <div className="bg-white dark:bg-gray-700 p-2 rounded-lg inline-block">
                  <Image
                    src={`${basePath}/images/sponsor/sponsor_wechat.jpg`}
                    alt="微信打赏码"
                    className="max-w-full"
                    width={220}
                    height={300}
                    preview={false}
                  />
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12} className="text-center">
              <Card
                title={
                  <Text strong className="text-blue-500">
                    支付宝
                  </Text>
                }
                variant="outlined"
                className="flex flex-col items-center"
              >
                <div className="bg-white dark:bg-gray-700 p-2 rounded-lg inline-block">
                  <Image
                    src={`${basePath}/images/sponsor/sponsor_alipay.jpg`}
                    alt="支付宝打赏码"
                    className="max-w-full"
                    width={220}
                    height={300}
                    preview={false}
                  />
                </div>
              </Card>
            </Col>
          </Row>

          <Paragraph className="text-center text-lg mt-6">感谢您的支持与鼓励！❤️</Paragraph>
        </Card>
      </Card>
    </div>
  );
}
