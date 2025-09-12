import React from 'react';
import DashboardLayout from '../../../shared/layouts/dashboard-layout';
import DashboardTopBar from '../../../shared/layouts/dashboard-top-bar';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();
  const data = [{ label: t('navbar.text.dashboard'), href: '/dashboard' }];

  return (
    <>
      <DashboardTopBar breadcrumb={data}></DashboardTopBar>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
        quibusdam dolores possimus dolorem aut minus, illum odio laudantium
        eligendi quaerat amet temporibus harum alias ad totam perspiciatis,
        omnis aliquid reiciendis fugit sapiente voluptatem consectetur
        accusantium facere! Iusto facere culpa necessitatibus quidem numquam
        assumenda illo a illum laboriosam fugiat non, deserunt voluptatibus
        odio. Itaque dolore sit, delectus ipsum inventore consequatur magnam
        odit dignissimos accusantium dolores soluta beatae doloribus adipisci
        tempora nostrum natus veniam et ratione voluptatibus. Eius mollitia
        quibusdam et esse! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Eum repellendus alias qui, corporis dolore consequatur nihil
        voluptatem officia similique illo autem ullam harum exercitationem
        accusamus quibusdam aut deserunt fugit ad! Similique laudantium dolorem
        sapiente itaque dolor neque obcaecati nesciunt. Ipsam nihil beatae quae
        tempora veniam perferendis ratione, deleniti, aspernatur magni itaque
        vitae eius id, quod eum suscipit totam dicta dolorem non hic quibusdam
        praesentium! Tempore, expedita mollitia aliquam soluta eveniet totam
        quod, animi asperiores esse alias modi voluptate distinctio veritatis!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
        quibusdam dolores possimus dolorem aut minus, illum odio laudantium
        eligendi quaerat amet temporibus harum alias ad totam perspiciatis,
        omnis aliquid reiciendis fugit sapiente voluptatem consectetur
        accusantium facere! Iusto facere culpa necessitatibus quidem numquam
        assumenda illo a illum laboriosam fugiat non, deserunt voluptatibus
        odio. Itaque dolore sit, delectus ipsum inventore consequatur magnam
        odit dignissimos accusantium dolores soluta beatae doloribus adipisci
        tempora nostrum natus veniam et ratione voluptatibus. Eius mollitia
        quibusdam et esse! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Eum repellendus alias qui, corporis dolore consequatur nihil
        voluptatem officia similique illo autem ullam harum exercitationem
        accusamus quibusdam aut deserunt fugit ad! Similique laudantium dolorem
        sapiente itaque dolor neque obcaecati nesciunt. Ipsam nihil beatae quae
        tempora veniam perferendis ratione, deleniti, aspernatur magni itaque
        vitae eius id, quod eum suscipit totam dicta dolorem non hic quibusdam
        praesentium! Tempore, expedita mollitia aliquam soluta eveniet totam
        quod, animi asperiores esse alias modi voluptate distinctio veritatis!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
        quibusdam dolores possimus dolorem aut minus, illum odio laudantium
        eligendi quaerat amet temporibus harum alias ad totam perspiciatis,
        omnis aliquid reiciendis fugit sapiente voluptatem consectetur
        accusantium facere! Iusto facere culpa necessitatibus quidem numquam
        assumenda illo a illum laboriosam fugiat non, deserunt voluptatibus
        odio. Itaque dolore sit, delectus ipsum inventore consequatur magnam
        odit dignissimos accusantium dolores soluta beatae doloribus adipisci
        tempora nostrum natus veniam et ratione voluptatibus. Eius mollitia
        quibusdam et esse! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Eum repellendus alias qui, corporis dolore consequatur nihil
        voluptatem officia similique illo autem ullam harum exercitationem
        accusamus quibusdam aut deserunt fugit ad! Similique laudantium dolorem
        sapiente itaque dolor neque obcaecati nesciunt. Ipsam nihil beatae quae
        tempora veniam perferendis ratione, deleniti, aspernatur magni itaque
        vitae eius id, quod eum suscipit totam dicta dolorem non hic quibusdam
        praesentium! Tempore, expedita mollitia aliquam soluta eveniet totam
        quod, animi asperiores esse alias modi voluptate distinctio veritatis!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
        quibusdam dolores possimus dolorem aut minus, illum odio laudantium
        eligendi quaerat amet temporibus harum alias ad totam perspiciatis,
        omnis aliquid reiciendis fugit sapiente voluptatem consectetur
        accusantium facere! Iusto facere culpa necessitatibus quidem numquam
        assumenda illo a illum laboriosam fugiat non, deserunt voluptatibus
        odio. Itaque dolore sit, delectus ipsum inventore consequatur magnam
        odit dignissimos accusantium dolores soluta beatae doloribus adipisci
        tempora nostrum natus veniam et ratione voluptatibus. Eius mollitia
        quibusdam et esse! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Eum repellendus alias qui, corporis dolore consequatur nihil
        voluptatem officia similique illo autem ullam harum exercitationem
        accusamus quibusdam aut deserunt fugit ad! Similique laudantium dolorem
        sapiente itaque dolor neque obcaecati nesciunt. Ipsam nihil beatae quae
        tempora veniam perferendis ratione, deleniti, aspernatur magni itaque
        vitae eius id, quod eum suscipit totam dicta dolorem non hic quibusdam
        praesentium! Tempore, expedita mollitia aliquam soluta eveniet totam
        quod, animi asperiores esse alias modi voluptate distinctio veritatis!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
        quibusdam dolores possimus dolorem aut minus, illum odio laudantium
        eligendi quaerat amet temporibus harum alias ad totam perspiciatis,
        omnis aliquid reiciendis fugit sapiente voluptatem consectetur
        accusantium facere! Iusto facere culpa necessitatibus quidem numquam
        assumenda illo a illum laboriosam fugiat non, deserunt voluptatibus
        odio. Itaque dolore sit, delectus ipsum inventore consequatur magnam
        odit dignissimos accusantium dolores soluta beatae doloribus adipisci
        tempora nostrum natus veniam et ratione voluptatibus. Eius mollitia
        quibusdam et esse! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Eum repellendus alias qui, corporis dolore consequatur nihil
        voluptatem officia similique illo autem ullam harum exercitationem
        accusamus quibusdam aut deserunt fugit ad! Similique laudantium dolorem
        sapiente itaque dolor neque obcaecati nesciunt. Ipsam nihil beatae quae
        tempora veniam perferendis ratione, deleniti, aspernatur magni itaque
        vitae eius id, quod eum suscipit totam dicta dolorem non hic quibusdam
        praesentium! Tempore, expedita mollitia aliquam soluta eveniet totam
        quod, animi asperiores esse alias modi voluptate distinctio veritatis!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
        quibusdam dolores possimus dolorem aut minus, illum odio laudantium
        eligendi quaerat amet temporibus harum alias ad totam perspiciatis,
        omnis aliquid reiciendis fugit sapiente voluptatem consectetur
        accusantium facere! Iusto facere culpa necessitatibus quidem numquam
        assumenda illo a illum laboriosam fugiat non, deserunt voluptatibus
        odio. Itaque dolore sit, delectus ipsum inventore consequatur magnam
        odit dignissimos accusantium dolores soluta beatae doloribus adipisci
        tempora nostrum natus veniam et ratione voluptatibus. Eius mollitia
        quibusdam et esse! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Eum repellendus alias qui, corporis dolore consequatur nihil
        voluptatem officia similique illo autem ullam harum exercitationem
        accusamus quibusdam aut deserunt fugit ad! Similique laudantium dolorem
        sapiente itaque dolor neque obcaecati nesciunt. Ipsam nihil beatae quae
        tempora veniam perferendis ratione, deleniti, aspernatur magni itaque
        vitae eius id, quod eum suscipit totam dicta dolorem non hic quibusdam
        praesentium! Tempore, expedita mollitia aliquam soluta eveniet totam
        quod, animi asperiores esse alias modi voluptate distinctio veritatis!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
        quibusdam dolores possimus dolorem aut minus, illum odio laudantium
        eligendi quaerat amet temporibus harum alias ad totam perspiciatis,
        omnis aliquid reiciendis fugit sapiente voluptatem consectetur
        accusantium facere! Iusto facere culpa necessitatibus quidem numquam
        assumenda illo a illum laboriosam fugiat non, deserunt voluptatibus
        odio. Itaque dolore sit, delectus ipsum inventore consequatur magnam
        odit dignissimos accusantium dolores soluta beatae doloribus adipisci
        tempora nostrum natus veniam et ratione voluptatibus. Eius mollitia
        quibusdam et esse! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Eum repellendus alias qui, corporis dolore consequatur nihil
        voluptatem officia similique illo autem ullam harum exercitationem
        accusamus quibusdam aut deserunt fugit ad! Similique laudantium dolorem
        sapiente itaque dolor neque obcaecati nesciunt. Ipsam nihil beatae quae
        tempora veniam perferendis ratione, deleniti, aspernatur magni itaque
        vitae eius id, quod eum suscipit totam dicta dolorem non hic quibusdam
        praesentium! Tempore, expedita mollitia aliquam soluta eveniet totam
        quod, animi asperiores esse alias modi voluptate distinctio veritatis!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
        quibusdam dolores possimus dolorem aut minus, illum odio laudantium
        eligendi quaerat amet temporibus harum alias ad totam perspiciatis,
        omnis aliquid reiciendis fugit sapiente voluptatem consectetur
        accusantium facere! Iusto facere culpa necessitatibus quidem numquam
        assumenda illo a illum laboriosam fugiat non, deserunt voluptatibus
        odio. Itaque dolore sit, delectus ipsum inventore consequatur magnam
        odit dignissimos accusantium dolores soluta beatae doloribus adipisci
        tempora nostrum natus veniam et ratione voluptatibus. Eius mollitia
        quibusdam et esse! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Eum repellendus alias qui, corporis dolore consequatur nihil
        voluptatem officia similique illo autem ullam harum exercitationem
        accusamus quibusdam aut deserunt fugit ad! Similique laudantium dolorem
        sapiente itaque dolor neque obcaecati nesciunt. Ipsam nihil beatae quae
        tempora veniam perferendis ratione, deleniti, aspernatur magni itaque
        vitae eius id, quod eum suscipit totam dicta dolorem non hic quibusdam
        praesentium! Tempore, expedita mollitia aliquam soluta eveniet totam
        quod, animi asperiores esse alias modi voluptate distinctio veritatis!
      </p>
    </>
  );
};

export default DashboardPage;

