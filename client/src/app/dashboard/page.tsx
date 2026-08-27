'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PageShell, { PageTitle } from '@/components/PageShell';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';

import ProfileTab from '@/components/dashboard/ProfileTab';
import MyRegistrationsTab from '@/components/dashboard/MyRegistrationsTab';
import MyBlogsTab from '@/components/dashboard/MyBlogsTab';
import UsersAdmin from '@/components/dashboard/UsersAdmin';
import EventsAdmin from '@/components/dashboard/EventsAdmin';
import BlogsAdmin from '@/components/dashboard/BlogsAdmin';
import GalleryAdmin from '@/components/dashboard/GalleryAdmin';
import AnnouncementsAdmin from '@/components/dashboard/AnnouncementsAdmin';
import TeamAdmin from '@/components/dashboard/TeamAdmin';
import NewslettersAdmin from '@/components/dashboard/NewslettersAdmin';
import ContactAdmin from '@/components/dashboard/ContactAdmin';
import RegistrationsAdmin from '@/components/dashboard/RegistrationsAdmin';

function DashboardInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get('tab') || 'profile';
  const isStaff = user && (user.role === 'admin' || user.role === 'eb');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) return <PageShell><Spinner label="Verifying clearance" /></PageShell>;

  const memberTabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'my-registrations', label: 'My RSVPs' },
    { id: 'my-blogs', label: 'My Stories' },
  ];
  const staffTabs = [
    ...(isStaff ? [{ id: 'manage-events', label: 'Events' }] : []),
    ...(isStaff ? [{ id: 'moderate-blogs', label: 'Blog Queue' }] : []),
    ...(isStaff ? [{ id: 'gallery-admin', label: 'Gallery' }] : []),
    ...(isStaff ? [{ id: 'announcements', label: 'Announcements' }] : []),
    ...(isStaff ? [{ id: 'team-admin', label: 'Team' }] : []),
    ...(isStaff ? [{ id: 'newsletters', label: 'Newsletters' }] : []),
    ...(isStaff ? [{ id: 'inbox', label: 'Inbox' }] : []),
    ...(isStaff ? [{ id: 'attendance', label: 'Attendance' }] : []),
    ...(user.role === 'admin' ? [{ id: 'users', label: 'Users' }] : []),
  ];

  const tabs = [...memberTabs, ...staffTabs];

  return (
    <PageShell>
      <PageTitle
        eyebrow={`${user.role.toUpperCase()} Console · ${user.name}`}
        title="Mission Control"
      />

      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-2 mb-12">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard?tab=${t.id}`}
            className="rounded-full px-4 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300"
            style={
              tab === t.id
                ? { background: 'linear-gradient(90deg,#00f0ff,#a200ff)', color: '#050816' }
                : {
                    border: '1px solid rgba(0,240,255,0.25)',
                    color: 'rgba(226,232,240,0.7)',
                    background: 'rgba(0,240,255,0.04)',
                  }
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {tab === 'profile' && <ProfileTab />}
        {tab === 'my-registrations' && <MyRegistrationsTab />}
        {tab === 'my-blogs' && <MyBlogsTab />}
        {tab === 'users' && user.role === 'admin' && <UsersAdmin />}
        {tab === 'manage-events' && isStaff && <EventsAdmin />}
        {tab === 'moderate-blogs' && isStaff && <BlogsAdmin />}
        {tab === 'gallery-admin' && isStaff && <GalleryAdmin />}
        {tab === 'announcements' && isStaff && <AnnouncementsAdmin />}
        {tab === 'team-admin' && isStaff && <TeamAdmin />}
        {tab === 'newsletters' && isStaff && <NewslettersAdmin />}
        {tab === 'inbox' && isStaff && <ContactAdmin />}
        {tab === 'attendance' && isStaff && <RegistrationsAdmin />}
      </div>
    </PageShell>
  );
}


export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <Spinner label="Loading mission control" />
        </PageShell>
      }
    >
      <DashboardInner />
    </Suspense>
  );
}
